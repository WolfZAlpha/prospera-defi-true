'use client';  // Add this at the top of the file

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '../../styles/SelectionPage.module.css';

const SelectionPage: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.selectionPage}>
      <button
        className={`${styles.button} ${styles.buttonIco}`}
        onClick={() => handleNavigation('http://www.prosperaico.com')}
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
