import { Injectable } from '@angular/core';
import {
  createDecartClient,
  models,
  ModelDefinition,
  RealTimeClient,
  RealTimeClientConnectOptions,
  SetInput,
} from '@decartai/sdk';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export type RealtimeSpeedMode = 'standard' | 'fast';

export interface RealtimeGarment {
  prompt: string;
  image: File | string | null;
}

export interface RealtimeCallbacks {
  onRemoteStream: (stream: MediaStream) => void;
  onConnectionChange: (state: string) => void;
  onError: (message: string) => void;
}

export interface RealtimeTokenInfo {
  token: string;
  expiresAt: string | null;
  receivedAt: Date;
}

interface RealtimeTokenResponse {
  apiKey: string;
  expiresAt?: string;
}

@Injectable({ providedIn: 'root' })
export class DecartRealtimeService {
  private readonly model = models.realtime('lucy-vton-3.6');
  private realtimeClient: RealTimeClient | null = null;
  private connectionGeneration = 0;
  private connecting = false;
  latestTokenInfo: RealtimeTokenInfo | null = null;
  private readonly tokenUrl =
    `${environment.apiUrl.replace(/\/api\/v1\/?$/, '')}/api/realtime-token`;

  constructor(private authService: AuthService) {}

  getModel(): ModelDefinition {
    return this.model;
  }

  get isConnected(): boolean {
    return this.realtimeClient?.isConnected() ?? false;
  }

  async connect(
    stream: MediaStream,
    garment: RealtimeGarment,
    speed: RealtimeSpeedMode,
    callbacks: RealtimeCallbacks
  ): Promise<void> {
    if (this.realtimeClient || this.connecting) {
      throw new Error('A virtual try-on session is already active.');
    }

    this.connecting = true;
    const generation = ++this.connectionGeneration;
    const options: RealTimeClientConnectOptions = {
      model: this.model,
      mirror: 'auto',
      onRemoteStream: remoteStream => {
        if (generation === this.connectionGeneration) callbacks.onRemoteStream(remoteStream);
      },
      onConnectionChange: state => {
        if (generation === this.connectionGeneration) callbacks.onConnectionChange(state);
      },
    };

    if (speed === 'fast') options.speed = 'fast';
    if (garment.prompt.trim() || garment.image) {
      options.initialState = {
        prompt: garment.prompt.trim() ? { text: garment.prompt.trim(), enhance: true } : undefined,
        image: garment.image ?? undefined,
      };
    }

    try {
      const client = createDecartClient({ apiKeyProvider: () => this.fetchClientToken() });
      const realtimeClient = await client.realtime.connect(stream, options);
      if (generation !== this.connectionGeneration) {
        realtimeClient.disconnect();
        return;
      }

      this.realtimeClient = realtimeClient;
      realtimeClient.on('error', error => callbacks.onError(error.message));
      realtimeClient.on('sessionEnded', event => {
        callbacks.onError(`The Decart session ended: ${event.reason.replace(/_/g, ' ')}.`);
      });
    } finally {
      if (generation === this.connectionGeneration) this.connecting = false;
    }
  }

  async setGarment(garment: RealtimeGarment): Promise<void> {
    if (!this.realtimeClient || !this.realtimeClient.isConnected()) {
      throw new Error('The virtual try-on session is not connected.');
    }

    const state: SetInput = {
      prompt: garment.prompt.trim(),
      image: garment.image,
    };
    await this.realtimeClient.set(state);
  }

  disconnect(): void {
    this.connectionGeneration += 1;
    this.connecting = false;
    this.realtimeClient?.disconnect();
    this.realtimeClient = null;
  }

  private async fetchClientToken(): Promise<string> {
    let accessToken = this.authService.getAccessToken();
    if (!accessToken) throw new Error('Sign in to start a virtual try-on session.');

    let response = await this.requestClientToken(accessToken);
    if (response.status === 401) {
      await firstValueFrom(this.authService.refreshToken());
      accessToken = this.authService.getAccessToken();
      if (!accessToken) throw new Error('Your sign-in has expired. Sign in again to continue.');
      response = await this.requestClientToken(accessToken);
    }

    if (!response.ok) {
      let detail = `Token service returned HTTP ${response.status}.`;
      try {
        const body = await response.json() as { detail?: unknown };
        if (typeof body.detail === 'string' && body.detail) detail = body.detail;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
      }
      throw new Error(detail);
    }

    let tokenData: RealtimeTokenResponse;
    try {
      tokenData = await response.json() as RealtimeTokenResponse;
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error('The token service returned an invalid response.');
      throw error;
    }
    if (!tokenData.apiKey) throw new Error('The token service did not return a client token.');
    this.latestTokenInfo = {
      token: tokenData.apiKey,
      expiresAt: tokenData.expiresAt ?? null,
      receivedAt: new Date(),
    };
    return tokenData.apiKey;
  }

  async fetchTokenInfo(): Promise<RealtimeTokenInfo> {
    await this.fetchClientToken();
    return this.latestTokenInfo!;
  }

  async fetchCredits(): Promise<number> {
    let accessToken = this.authService.getAccessToken();
    if (!accessToken) throw new Error('Sign in to check Decart credits.');

    let response = await this.requestCredits(accessToken);
    if (response.status === 401) {
      await firstValueFrom(this.authService.refreshToken());
      accessToken = this.authService.getAccessToken();
      if (!accessToken) throw new Error('Your sign-in has expired. Sign in again to continue.');
      response = await this.requestCredits(accessToken);
    }

    if (!response.ok) {
      let detail = `Credits service returned HTTP ${response.status}.`;
      try {
        const body = await response.json() as { detail?: unknown };
        if (typeof body.detail === 'string' && body.detail) detail = body.detail;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
      }
      throw new Error(detail);
    }

    let creditsData: { credits?: unknown };
    try {
      creditsData = await response.json() as { credits?: unknown };
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error('The credits service returned an invalid response.');
      throw error;
    }
    if (typeof creditsData.credits !== 'number' || !Number.isInteger(creditsData.credits) || creditsData.credits < 0) {
      throw new Error('The credits service returned an invalid balance.');
    }
    return creditsData.credits;
  }

  private requestClientToken(accessToken: string): Promise<Response> {
    const url = `${environment.apiUrl.replace(/\/api\/v1\/?$/, '')}/api/realtime-token`;
    return fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  private requestCredits(accessToken: string): Promise<Response> {
    const url = `${environment.apiUrl.replace(/\/api\/v1\/?$/, '')}/api/realtime-credits`;
    return fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
