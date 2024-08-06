import React from 'react';
import styles from '../../styles/PreLoader.module.css';

interface DynamicVideoProps {
  src: string;
}

const DynamicVideo: React.FC<DynamicVideoProps> = ({ src }) => {
  return (
    <video autoPlay muted loop playsInline id="background-video" className={styles.backgroundVideo}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default DynamicVideo;