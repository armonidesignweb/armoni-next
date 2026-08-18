import { getRequestConfig } from 'next-intl/server';
import { locales } from '../middleware';

export default getRequestConfig(async ({ locale }) => {
  const targetLocale = (locale && locales.includes(locale as any)) ? locale : 'tr';

  return {
    locale: targetLocale,
    messages: (await import(`../messages/${targetLocale}.json`)).default
  };
});
