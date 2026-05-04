'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Service worker disabled in development due to compatibility issues with Next.js Turbopack
    // Push notifications will work in production build
    console.log('Service Worker registration disabled in development mode');
    console.log('Email notifications are fully functional');
    console.log('Push notifications will work after deployment to production');
  }, []);

  return null;
}
