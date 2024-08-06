'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/SelectionPage.module.css';

const SelectionPage: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path.startsWith('https')) {
      // For external links, use window.location
      window.location.href = path;
    } else {
      // For internal navigation, use router.push
      router.push(path);
    }
  };

  return (
    <div className={styles.selectionPage}>
      <button
        className={`${styles.button} ${styles.buttonIco}`}
        onClick={() => handleNavigation('https://prosperaico.com')}
      >
        ICO
        <p>Initial Coin Offering</p>
      </button>
      <button
        className={`${styles.button} ${styles.buttonDesktop}`}
      >
        Desktop
        <p>Desktop Web Environment</p>
        <p>Coming Soon!</p>
      </button>
    </div>
  );
};

export default SelectionPage;