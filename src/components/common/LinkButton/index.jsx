import styles from "./LinkButton.module.css";

const LinkButton = ({ href, children }) => {
  return (
    <a href={href}className={styles.link}>
      {children}
    </a>
  );
};

export default LinkButton;
