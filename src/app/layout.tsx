'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import PreLoader from './components/PreLoader';
import ErrorBoundary from './components/ErrorBoundary';

const inter = Inter({ subsets: ["latin"] });

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('preloaderCompleted')) {
      setLoading(false);
    }

    // Dynamically import Bootstrap JS
    const loadBootstrap = async () => {
      try {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
      } catch (error) {
        console.error("Failed to load Bootstrap JS:", error);
      }
    };

    loadBootstrap();
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderCompleted', 'true');
    setLoading(false);
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {loading ? (
            <PreLoader onComplete={handlePreloaderComplete} />
          ) : (
            children
          )}
        </ErrorBoundary>
      </body>
    </html>
  );
}