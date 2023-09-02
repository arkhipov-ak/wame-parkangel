// ImageSkeleton.js
import React from 'react';
import styles from './ImageSkeleton.module.css';

const ImageSkeleton = ({ width, height }) => {
  return <div className={styles.skeleton} style={{ width, height }}></div>;
};

export default ImageSkeleton;
