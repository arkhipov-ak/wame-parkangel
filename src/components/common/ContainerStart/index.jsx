import styles from "./Container.module.css";

const ContainerStart = ({ children }) => {
  return (
    <section className={styles.container}>
      {children}
    </section>
  );
};

export default ContainerStart;
