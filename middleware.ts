import createMiddleware from 'next-intl/middleware';

export const locales = ['tr', 'en', 'de', 'ru', 'ar'] as const;
export const defaultLocale = 'tr' as const;

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|images|.*\\..*).*)']
};
