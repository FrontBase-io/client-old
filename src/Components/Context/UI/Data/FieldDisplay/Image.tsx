import { CSSProperties } from "react";
import styles from "./Image.module.scss";

const DisplayImage: React.FC<{
  src: string;
  alt: string;
  style?: CSSProperties;
}> = ({ src, alt, style }) => {
  return (
    <div className={styles.ambilight} style={style}>
      <div className={styles.imgcon}>
        <img src={src} alt={alt} className="image" />
      </div>
      <img src={src} alt={alt} className={styles.light} />
    </div>
  );
};

export default DisplayImage;
