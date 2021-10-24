import styles from "./Image.module.scss";

const DisplayImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className={styles.ambilight}>
      <div className={styles.imgcon}>
        <img src={src} alt={alt} className="image" />
      </div>
      <img src={src} alt={alt} className={styles.light} />
    </div>
  );
};

export default DisplayImage;
