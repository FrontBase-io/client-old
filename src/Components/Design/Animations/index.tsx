import React, { CSSProperties } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.05,
      duration: 0.1,
    },
  },
};

const item = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Animate: React.FC = ({ children }) => {
  return (
    <motion.div
      style={{ position: "relative", height: "100%" }}
      initial={{ opacity: 0, top: -20 }}
      animate={{ opacity: 1, top: 0 }}
    >
      {children}
    </motion.div>
  );
};

const Container: React.FC = ({ children }) => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="visible"
    style={{ height: "100%" }}
  >
    {children}
  </motion.div>
);

const Item: React.FC<{ key: string; style?: CSSProperties }> = ({
  key,
  children,
  style,
}) => (
  <motion.div key={key} className="item" variants={item} style={style}>
    {children}
  </motion.div>
);

export { Animate, Container, Item };
const animations = { Animate, Container, Item };
export default animations;
