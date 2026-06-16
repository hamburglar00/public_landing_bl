export function resolveFontFamily(token: string | undefined): string | undefined {
  const value = (token || 'system').toLowerCase();

  if (value === 'system') {
    return undefined;
  }

  switch (value) {
    case 'roboto':
      return '"Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'poppins':
      return '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'montserrat':
      return '"Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'bebas':
      return '"Bebas Neue", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'anton':
      return '"Anton", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'pp_mori':
      return '"PP Mori", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'alpha':
      return '"Alpha", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    default:
      return token;
  }
}

export function getGoogleFontStylesheetHref(token: string | undefined): string | undefined {
  const value = (token || 'system').toLowerCase();
  const baseUrl = 'https://fonts.googleapis.com/css2';

  switch (value) {
    case 'roboto':
      return `${baseUrl}?family=Roboto:wght@400;500;700&display=swap`;
    case 'poppins':
      return `${baseUrl}?family=Poppins:wght@400;600;700&display=swap`;
    case 'montserrat':
      return `${baseUrl}?family=Montserrat:wght@400;500;700&display=swap`;
    case 'bebas':
      return `${baseUrl}?family=Bebas+Neue&display=swap`;
    case 'anton':
      return `${baseUrl}?family=Anton&display=swap`;
    default:
      return undefined;
  }
}
