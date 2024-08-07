'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PreLoader from './components/PreLoader';

export default function Home() {
  const router = useRouter();
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    router.push('/login');
  };

  if (showPreloader) {
    return <PreLoader onComplete={handlePreloaderComplete} />;
  }

  return null;
}