import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { locales } from '../middleware';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the incoming locale from the request
  const requested = await requestLocale;

  // Validate and fallback to default locale
  const locale = hasLocale(locales, requested) ? requested : 'tr';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
