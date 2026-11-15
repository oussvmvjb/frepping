// PRODUCTION — ng build --configuration production uses this file.
// This must always point to the Render backend URL.
// Never change this to localhost.
export const environment = {
  production: true,
  apiUrl: 'https://freepping-backend.onrender.com/api/v1',
  realtimeCamera: {
    mobile: {
      enabled: true,
      width: 960,
      height: 540,
      frameRate: 24,
      minimumPacketsReceived: 500,
      packetLossThreshold: 0.05,
      jitterBufferThresholdMs: 300
    }
  }
};
