import { Injectable } from '@angular/core';

export interface RealtimeDiagnosticEntry {
  timestamp: string;
  sessionId: string;
  device: string;
  event: string;
  connectionState: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class RealtimeDiagnosticsService {
  readonly enabled = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('debug') === 'eruda';
  readonly entries: RealtimeDiagnosticEntry[] = [];

  sessionId = 'not-started';
  connectionState = 'idle';
  cameraStatus = 'not-started';
  tokenStatus = 'not-requested';
  localStreamStatus = 'not-started';
  remoteStreamStatus = 'not-received';
  videoStatus = 'not-started';
  negotiatedVideoCodec = 'Unavailable through @decartai/sdk 0.2.14 public API';
  requestedVideoCodec: string = 'not-yet-determined';
  lastError: string | null = null;
  disconnectInitiator: string | null = null;
  sessionStartedAt: number | null = null;

  startSession(): string {
    this.sessionId = this.createSessionId();
    this.sessionStartedAt = Date.now();
    this.connectionState = 'initializing camera';
    this.cameraStatus = 'initializing';
    this.tokenStatus = 'not-requested';
    this.localStreamStatus = 'not-started';
    this.remoteStreamStatus = 'not-received';
    this.videoStatus = 'not-started';
    this.negotiatedVideoCodec = 'Unavailable through @decartai/sdk 0.2.14 public API';
    this.requestedVideoCodec = 'not-yet-determined';
    this.lastError = null;
    this.disconnectInitiator = null;
    this.entries.length = 0;
    this.log('session.started', { secureContext: window.isSecureContext });
    return this.sessionId;
  }

  log(
    event: string,
    data?: Record<string, unknown>,
    error?: unknown
  ): void {
    const entry: RealtimeDiagnosticEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      device: this.deviceInfo(),
      event,
      connectionState: this.connectionState,
      ...(data ? { data: this.redact(data) as Record<string, unknown> } : {}),
      ...(error !== undefined ? { error: this.errorInfo(error) } : {}),
    };
    if (entry.error) this.lastError = `${entry.error.name}: ${entry.error.message}`;
    this.entries.push(entry);
    if (this.entries.length > 300) this.entries.shift();
    if (this.enabled) console.info('[FreppingTryOn]', entry);
  }

  traceDisconnect(event: string, initiator: string): void {
    this.disconnectInitiator = initiator;
    if (this.enabled) console.trace(`[FreppingTryOn] ${event}`, { initiator, sessionId: this.sessionId });
    this.log(event, { initiator, stack: new Error().stack });
  }

  snapshot(): Record<string, unknown> {
    return {
      sessionId: this.sessionId,
      device: this.deviceInfo(),
      connectionState: this.connectionState,
      cameraStatus: this.cameraStatus,
      localStreamStatus: this.localStreamStatus,
      tokenStatus: this.tokenStatus,
      remoteStreamStatus: this.remoteStreamStatus,
      videoStatus: this.videoStatus,
      negotiatedVideoCodec: this.negotiatedVideoCodec,
      requestedVideoCodec: this.requestedVideoCodec,
      browserVideoCodecCapabilities: this.getVideoCodecCapabilities(),
      lastError: this.lastError,
      disconnectInitiator: this.disconnectInitiator,
      sessionDurationMs: this.sessionStartedAt ? Date.now() - this.sessionStartedAt : 0,
      entries: this.entries,
    };
  }

  report(): string {
    return JSON.stringify(this.snapshot(), null, 2);
  }

  clear(): void {
    this.entries.length = 0;
    this.log('diagnostics.cleared');
  }

  getVideoCodecCapabilities(): Array<Record<string, unknown>> | string {
    const receiver = typeof RTCRtpReceiver !== 'undefined' ? RTCRtpReceiver : null;
    if (!receiver || typeof receiver.getCapabilities !== 'function') return 'unsupported';
    try {
      return receiver.getCapabilities('video')?.codecs.map(codec => ({
        mimeType: codec.mimeType,
        sdpFmtpLine: codec.sdpFmtpLine ?? null,
        clockRate: codec.clockRate,
        channels: codec.channels ?? null,
      })) ?? [];
    } catch (error) {
      return `unavailable: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  private deviceInfo(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    return `${navigator.userAgent} | platform=${navigator.platform || 'unknown'}`;
  }

  private createSessionId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  private errorInfo(error: unknown): RealtimeDiagnosticEntry['error'] {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: this.redactString(error.message),
        ...(error.stack ? { stack: this.redactString(error.stack) } : {}),
      };
    }
    return { name: 'UnknownError', message: this.redactString(String(error)) };
  }

  private redact(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(item => this.redact(item));
    if (!value || typeof value !== 'object') {
      return typeof value === 'string' ? this.redactString(value) : value;
    }
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        /authorization|access.?token|refresh.?token|api.?key|credential|password|secret/i.test(key)
          ? '[REDACTED]'
          : this.redact(item),
      ])
    );
  }

  private redactString(value: string): string {
    return value
      .replace(/\bBearer\s+\S+/gi, 'Bearer [REDACTED]')
      .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[REDACTED_JWT]')
      .replace(/([?&](?:api_key|token|access_token|refresh_token|subscribe_token)=)[^&\s]+/gi, '$1[REDACTED]');
  }
}
