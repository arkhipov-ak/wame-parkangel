import React from "react";

import styles from "./VideoButton.module.css";

const VideoButton = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className={styles.video_button}>
      {children}
    </button>
  );
};

export default VideoButton;
