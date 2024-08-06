'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from '../../styles/PreLoader.module.css';
import { useRouter } from 'next/navigation';

const DynamicVideo = dynamic(() => import('../components/DynamicVideo'), { ssr: false });

interface PreLoaderProps {
  onComplete: () => void;
}

const PreLoader: React.FC<PreLoaderProps> = ({ onComplete }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const videoBackground = '/assets/desktop-backgrounds/video-backgrounds/Pre-Loader/prospera-main-bg-1.mp4';

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleButtonClick = () => {
    const userResponse = prompt("DO YOU WISH TO PROSPER HUMAN?");
    if (userResponse?.toLowerCase() === "yes") {
      onComplete();
      router.push('/login');
    } else {
      alert("User Authorization Denied. You have failed human. Try Again!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  useEffect(() => {
    const disableContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && (
        event.key === 'u' || event.key === 's' || event.key === 'i' || 
        event.key === 'c' || event.key === 'j' || event.key === 'k' || 
        event.key === 'h' || event.key === 'a')) {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    if (process.env.NODE_ENV === 'production') {
      const originalConsoleLog = console.log;
      Object.defineProperty(window, 'console', {
        get() {
          throw new Error('Console is disabled');
        },
        set(val) {
          originalConsoleLog(val);
        }
      });
    }

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.preloaderContainer}>
      <div className={styles.videoBackground}>
        {isClient && <DynamicVideo src={videoBackground} />}
      </div>
      <Image src="/images/logo.png" alt="Prospera Logo" width={256} height={256} className={styles.logo} />
      <Image src="/images/h4ck3rhuman.png" alt="Background Image" width={256} height={256} className={styles.backgroundImage} />
      <button className={styles.glowingBtn} onClick={handleButtonClick}>
        <span className={styles.glowingTxt}>P<span className={styles.faultyLetter}>ROSPER</span>A</span>
      </button>
    </div>
  );
};

export default PreLoader;