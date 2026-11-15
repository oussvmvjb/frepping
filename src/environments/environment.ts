// LOCAL DEVELOPMENT — ng serve uses this file.
// This must always point to your local FastAPI backend.
// Never change this to the production URL.
const getLocalApiUrl = (): string => {
  if (
    typeof window !== 'undefined' &&
    window.location?.hostname &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

export const environment = {
  production: false,
  get apiUrl(): string {
    return getLocalApiUrl();
  }
};
