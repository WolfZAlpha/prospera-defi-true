'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/PreLoader.module.css';
import { useRouter } from 'next/navigation';

const videoSrc = '/assets/desktop-backgrounds/video-backgrounds/Pre-Loader/prospera-main-bg-1.mp4';

interface PreLoaderProps {
  onComplete: () => void;
}

const PreLoader: React.FC<PreLoaderProps> = ({ onComplete }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const video = document.getElementById('background-video') as HTMLVideoElement;
      if (video) {
        video.addEventListener('loadedmetadata', () => {
          console.log('Video metadata loaded');
        });
        video.addEventListener('play', () => {
          console.log('Video started playing');
        });
        video.addEventListener('error', (e) => {
          console.error('Video error:', e);
        });
      } else {
        console.error('Video element not found');
      }
    }
  }, [isClient]);

  const handleButtonClick = () => {
    const userResponse = prompt("DO YOU WISH TO PROSPER HUMAN?");
    if (userResponse && ['yes', 'YES', 'Yes'].includes(userResponse.trim())) {
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
    <div className={`${styles.preloaderContainer} flex flex-col items-center justify-between min-h-screen w-full p-4`}>
      <div className={`${styles.videoBackground} fixed inset-0`}>
        {isClient && (
          <video
            autoPlay
            muted
            loop
            playsInline
            id="background-video"
            className={`${styles.backgroundVideo} object-cover w-full h-full`}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <Image src="/images/logo.png" alt="Prospera Logo" width={256} height={256} className={`${styles.logo} w-1/2 max-w-xs mb-8`} />
        <Image src="/images/h4ck3rhuman.png" alt="Background Image" width={256} height={256} className={`${styles.backgroundImage} w-3/4 max-w-sm mb-8`} />
      </div>
      <button className={`${styles.glowingBtn} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8`} onClick={handleButtonClick}>
        <span className={styles.glowingTxt}>P<span className={styles.faultyLetter}>ROSPER</span>A</span>
      </button>
    </div>
  );
};

export default PreLoader;