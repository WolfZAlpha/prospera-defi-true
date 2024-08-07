export function getAppUrl(path: string = ''): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.prosperadefi.com';
    return `${baseUrl}${path}`;
  }
  
  export function getAllowedHosts(): string[] {
    return ['www.prosperadefi.com', 'prosperadefi.com'];
  }