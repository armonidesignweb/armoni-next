import './globals.css';
import type { ReactNode } from 'react';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteSettings } from '@/models/SiteSettings';

export async function generateMetadata() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne();
    
    return {
      title: settings?.siteTitle || 'Armoni Design',
      description: settings?.metaDescription || 'Premium Mobilya Tasarımları',
      icons: {
        icon: settings?.favicon || '/icon.jpg',
      }
    };
  } catch (error) {
    return {
      title: 'Armoni Design',
      description: 'Premium Mobilya Tasarımları',
    };
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  let settings = null;
  try {
    await connectToDatabase();
    settings = await SiteSettings.findOne();
  } catch (e) {}

  return (
    <html>
      <head>
        {settings?.googleAnalytics && (
          <div dangerouslySetInnerHTML={{ __html: settings.googleAnalytics }} />
        )}
        {settings?.googleTagManager && (
          <div dangerouslySetInnerHTML={{ __html: settings.googleTagManager }} />
        )}
        {settings?.googleAds && (
          <div dangerouslySetInnerHTML={{ __html: settings.googleAds }} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
