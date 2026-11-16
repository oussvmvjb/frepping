import { Injectable } from '@angular/core';
import {
  createDecartClient,
  models,
  Logger,
  ModelDefinition,
  RealTimeClient,
  RealTimeClientConnectOptions,
  SetInput,
  WebRTCStats,
} from '@decartai/sdk';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { RealtimeDiagnosticsService } from './realtime-diagnostics.service';

export type RealtimeSpeedMode = 'standard' | 'fast';

export interface RealtimeGarment {
  prompt: string;
  image: File | string | null;
}

export interface RealtimeCallbacks {
  onRemoteStream: (stream: MediaStream) => void;
  onConnectionChange: (state: string) => void;
  onError: (message: string) => void;
  onRemoteVideoStats?: (stats: WebRTCStats['video']) => void;
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
  private pendingConnectionGeneration: number | null = null;
  private lastStatsAt = 0;
  latestTokenInfo: RealtimeTokenInfo | null = null;
  private readonly tokenUrl =
    `${environment.apiUrl.replace(/\/api\/v1\/?$/, '')}/api/realtime-token`;

  constructor(
    private readonly authService: AuthService,
    private readonly diagnostics: RealtimeDiagnosticsService
  ) {}

  getModel(): ModelDefinition {
    return this.getActiveModel();
  }

  private getActiveModel(): ModelDefinition {
    if (typeof window !== 'undefined') {
      const modelParam = new URLSearchParams(window.location.search).get('model')?.trim();
      if (modelParam) {
        try {
          return models.realtime(modelParam as any);
        } catch {
          // Unknown model, fall back to default
        }
      }
    }
    return models.realtime('lucy-vton-3.6');
  }

  get isConnected(): boolean {
    return this.realtimeClient?.isConnected() ?? false;
  }

  get isConnecting(): boolean {
    return this.connecting;
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
    this.pendingConnectionGeneration = generation;
    const connectStartedAt = Date.now();
    const activeModel = this.getActiveModel();
    this.diagnostics.log('decart.connect.started', {
      model: activeModel.name,
      speed,
      initialPromptPresent: Boolean(garment.prompt.trim()),
      initialPromptLength: garment.prompt.trim().length,
      image: this.imageInfo(garment.image),
      localVideoTrackCount: stream.getVideoTracks().length,
      localAudioTrackCount: stream.getAudioTracks().length,
    });
    this.diagnostics.log('webrtc.codec-capabilities', {
      source: 'RTCRtpReceiver.getCapabilities(video); browser support only, not the negotiated codec',
      codecs: this.diagnostics.getVideoCodecCapabilities(),
      negotiatedCodec: 'not exposed by installed SDK stats API',
    });
    // VP8 is universally decoded on Android Chrome and iOS/Safari WebRTC.
    // H.264 requires specific profile-level-id negotiation; mobile WebKit
    // receivers report framesDecoded=0 when the server encodes an incompatible profile.
    // In @decartai/sdk, preferredVideoCodec only sets the LOCAL publish codec.
    // To force the DECART INFERENCE SERVER to send VP8 downstream, we must pass
    // livekit_server_codec=vp8 via queryParams in RealTimeClientConnectOptions.
    const preferredCodec = this.detectMobileVideoCodec();
    const queryParams: Record<string, string> = {};
    if (preferredCodec === 'vp8') {
      queryParams['livekit_server_codec'] = 'vp8';
    } else if (preferredCodec === 'vp9') {
      queryParams['livekit_server_codec'] = 'vp9';
    }

    this.diagnostics.log('webrtc.preferred-codec', {
      codec: preferredCodec,
      serverCodec: queryParams['livekit_server_codec'] ?? 'default (server decides, typically h264)',
      reason: preferredCodec === 'vp8'
        ? 'mobile browser or explicit vp8 requested; forcing both local publish codec and server livekit_server_codec to vp8'
        : 'desktop browser; using SDK default h264',
    });
    this.diagnostics.requestedVideoCodec = preferredCodec === 'vp8'
      ? 'vp8 (client publish + server remote via livekit_server_codec)'
      : preferredCodec;

    const options: RealTimeClientConnectOptions = {
      model: activeModel,
      mirror: 'auto',
      retries: 0,
      preferredVideoCodec: preferredCodec,
      ...(Object.keys(queryParams).length > 0 ? { queryParams } : {}),
      onRemoteStream: remoteStream => {
        if (generation !== this.connectionGeneration) return;
        this.diagnostics.remoteStreamStatus = 'received';
        this.diagnostics.log('webrtc.remote-stream.received', this.remoteStreamInfo(remoteStream));
        callbacks.onRemoteStream(remoteStream);
      },
      onConnectionChange: state => {
        if (generation !== this.connectionGeneration) return;
        this.diagnostics.connectionState = state;
        this.diagnostics.log('decart.connection-state.changed', { state, elapsedMs: Date.now() - connectStartedAt });
        callbacks.onConnectionChange(state);
        if (state === 'connected') {
          this.diagnostics.localStreamStatus = 'published by SDK';
          this.diagnostics.log('webrtc.local-track-published', this.localStreamInfo(stream));
        }
        if (state === 'generating') {
          this.diagnostics.log('decart.generation.started');
        }
        if (state === 'reconnecting') {
          this.diagnostics.traceDisconnect('decart.automatic-reconnect-blocked', 'SDK automatic reconnect');
          this.disconnect('automatic-reconnect-blocked');
          callbacks.onConnectionChange('disconnected');
        }
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
      this.diagnostics.log('decart.client.initializing');
      const logger: Logger = {
        debug: (message, data) => this.logSdkMessage('debug', message, data),
        info: (message, data) => this.logSdkMessage('info', message, data),
        warn: (message, data) => this.logSdkMessage('warn', message, data),
        error: (message, data) => this.logSdkMessage('error', message, data),
      };
      const client = createDecartClient({
        apiKeyProvider: () => this.fetchClientToken(),
        logger,
      });
      this.diagnostics.log('decart.client.initialized');
      const realtimeClient = await client.realtime.connect(stream, options);
      if (generation !== this.connectionGeneration) {
        this.diagnostics.traceDisconnect('decart.stale-connect-result.disconnected', 'stale connection generation');
        realtimeClient.disconnect();
        return;
      }

      this.realtimeClient = realtimeClient;
      this.diagnostics.log('decart.connect.resolved', {
        elapsedMs: Date.now() - connectStartedAt,
        sdkConnected: realtimeClient.isConnected(),
        sessionIdAvailable: Boolean(realtimeClient.sessionId),
      });
      realtimeClient.on('error', error => {
        this.diagnostics.log('decart.sdk.error', {
          code: error.code,
          message: error.message,
        }, error.cause ?? error);
        callbacks.onError(error.message);
      });
      realtimeClient.on('sessionEnded', event => {
        this.diagnostics.log('decart.session-ended', { reason: event.reason });
        callbacks.onError(`The Decart session ended: ${event.reason.replace(/_/g, ' ')}.`);
      });
      realtimeClient.on('generationTick', event => {
        this.diagnostics.log('decart.generation.tick', { seconds: event.seconds });
      });
      realtimeClient.on('generationEnded', event => {
        this.diagnostics.log('decart.generation.ended', { seconds: event.seconds, reason: event.reason });
      });
      realtimeClient.on('diagnostic', event => {
        this.diagnostics.log(`sdk.diagnostic.${event.name}`, { ...event.data });
      });
      realtimeClient.on('connectionQuality', report => {
        this.diagnostics.log('webrtc.connection-quality', { ...report });
      });
      realtimeClient.on('stats', stats => {
        const now = Date.now();
        if (now - this.lastStatsAt < 5000) return;
        this.lastStatsAt = now;
        this.diagnostics.log('webrtc.stats', {
          source: '@decartai/sdk normalized stats event; raw RTCRtpReceiver report is not exposed',
          inboundVideo: stats.video && {
            framesReceived: stats.video.framesReceived,
            framesDecoded: stats.video.framesDecoded,
            keyFramesDecoded: stats.video.keyFramesDecoded,
            framesPerSecond: stats.video.framesPerSecond,
            width: stats.video.frameWidth,
            height: stats.video.frameHeight,
            decoderImplementation: stats.video.decoderImplementation,
            avgDecodeTimeMs: stats.video.avgDecodeTimeMs,
            totalDecodeTimeSeconds: stats.video.avgDecodeTimeMs !== null && stats.video.framesDecoded > 0
              ? stats.video.avgDecodeTimeMs * stats.video.framesDecoded / 1000
              : null,
            freezeCount: stats.video.freezeCount,
            totalFreezesDuration: stats.video.totalFreezesDuration,
            framesDropped: stats.video.framesDropped,
            framesDroppedDelta: stats.video.framesDroppedDelta,
            pliCount: stats.video.pliCount,
            firCount: stats.video.firCount,
            nackCount: stats.video.nackCount,
            nackCountDelta: stats.video.nackCountDelta,
            packetsReceived: stats.video.packetsReceived,
            packetsLost: stats.video.packetsLost,
            packetsLostDelta: stats.video.packetsLostDelta,
            jitter: stats.video.jitter,
            avgJitterBufferMs: stats.video.avgJitterBufferMs,
            jitterBufferTargetDelayMs: stats.video.jitterBufferTargetDelayMs,
            jitterBufferMinimumDelayMs: stats.video.jitterBufferMinimumDelayMs,
            avgProcessingDelayMs: stats.video.avgProcessingDelayMs,
            avgInterFrameDelayMs: stats.video.avgInterFrameDelayMs,
            interFrameDelayStdDevMs: stats.video.interFrameDelayStdDevMs,
            bitrate: stats.video.bitrate,
          },
          outboundVideo: stats.outboundVideo && {
            framesPerSecond: stats.outboundVideo.framesPerSecond,
            width: stats.outboundVideo.frameWidth,
            height: stats.outboundVideo.frameHeight,
            bytesSent: stats.outboundVideo.bytesSent,
            bitrate: stats.outboundVideo.bitrate,
          },
          connection: stats.connection,
        });
        callbacks.onRemoteVideoStats?.(stats.video);
      });
    } catch (error) {
      this.diagnostics.log('decart.connect.failed', {
        elapsedMs: Date.now() - connectStartedAt,
      }, error);
      throw error;
    } finally {
      if (this.pendingConnectionGeneration === generation) {
        this.pendingConnectionGeneration = null;
        this.connecting = false;
      }
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

  disconnect(initiator = 'application'): void {
    if (!this.realtimeClient && !this.connecting) return;
    this.diagnostics.traceDisconnect('decart.client.disconnect', initiator);
    this.connectionGeneration += 1;
    this.diagnostics.connectionState = 'disconnected';
    const realtimeClient = this.realtimeClient;
    this.realtimeClient = null;
    realtimeClient?.disconnect();
  }

  private async fetchClientToken(): Promise<string> {
    const requestStartedAt = Date.now();
    this.diagnostics.tokenStatus = 'requesting';
    this.diagnostics.log('auth.realtime-token.requested');
    let accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      const error = new Error('Sign in to start a virtual try-on session.');
      this.diagnostics.tokenStatus = 'failed';
      this.diagnostics.log('auth.realtime-token.failed', undefined, error);
      throw error;
    }

    let response = await this.requestClientToken(accessToken);
    this.diagnostics.log('auth.realtime-token.response', {
      status: response.status,
      durationMs: Date.now() - requestStartedAt,
    });
    if (response.status === 401) {
      this.diagnostics.log('auth.refresh.started', { purpose: 'realtime token request' });
      await firstValueFrom(this.authService.refreshToken());
      accessToken = this.authService.getAccessToken();
      if (!accessToken) {
        const error = new Error('Your sign-in has expired. Sign in again to continue.');
        this.diagnostics.tokenStatus = 'failed';
        this.diagnostics.log('auth.refresh.failed', undefined, error);
        throw error;
      }
      this.diagnostics.log('auth.refresh.succeeded');
      response = await this.requestClientToken(accessToken);
      this.diagnostics.log('auth.realtime-token.retry-response', {
        status: response.status,
        durationMs: Date.now() - requestStartedAt,
      });
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
    this.diagnostics.tokenStatus = 'received';
    this.latestTokenInfo = {
      token: tokenData.apiKey,
      expiresAt: tokenData.expiresAt ?? null,
      receivedAt: new Date(),
    };
    this.diagnostics.log('auth.realtime-token.received', {
      durationMs: Date.now() - requestStartedAt,
      expiresAt: tokenData.expiresAt ?? null,
    });
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

  private logSdkMessage(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, unknown>
  ): void {
    this.diagnostics.log(`sdk.${level}`, { message, ...(data ? { details: data } : {}) });
  }

  /**
   * Returns 'vp8' on mobile browsers (Android Chrome, iOS Safari, iOS Chrome) so
   * the SDK requests VP8 from the Decart server. VP8 decodes cleanly on all mobile
   * WebRTC implementations without H.264 profile-level-id negotiation. Desktop keeps
   * the SDK default of h264. Only 'h264', 'vp8', and 'vp9' are accepted by the SDK.
   */
  private detectMobileVideoCodec(): 'h264' | 'vp8' | 'vp9' {
    if (typeof window !== 'undefined') {
      const paramCodec = new URLSearchParams(window.location.search).get('codec')?.toLowerCase()?.trim();
      if (paramCodec === 'vp8' || paramCodec === 'h264' || paramCodec === 'vp9') {
        return paramCodec;
      }
    }
    if (typeof navigator === 'undefined') return 'h264';
    const ua = navigator.userAgent;
    const isMobile =
      /Android/i.test(ua) ||
      /iPhone|iPad|iPod/i.test(ua) ||
      (/Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);
    return isMobile ? 'vp8' : 'h264';
  }

  private imageInfo(image: RealtimeGarment['image']): Record<string, unknown> {
    if (image instanceof File) return { type: 'File', mimeType: image.type, sizeBytes: image.size };
    if (typeof image === 'string') return { type: 'string-reference', length: image.length };
    return { type: image === null ? 'none' : typeof image };
  }

  private localStreamInfo(stream: MediaStream): Record<string, unknown> {
    return {
      streamId: stream.id,
      tracks: stream.getTracks().map(track => ({
        kind: track.kind,
        id: track.id,
        readyState: track.readyState,
        enabled: track.enabled,
        muted: track.muted,
      })),
    };
  }

  private remoteStreamInfo(stream: MediaStream): Record<string, unknown> {
    return {
      streamId: stream.id,
      videoTrackCount: stream.getVideoTracks().length,
      audioTrackCount: stream.getAudioTracks().length,
      tracks: stream.getTracks().map(track => ({
        kind: track.kind,
        readyState: track.readyState,
        enabled: track.enabled,
        muted: track.muted,
      })),
    };
  }
}
