import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
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
      style={{ position: "relative" }}
      initial={{ opacity: 0, top: -20 }}
      animate={{ opacity: 1, top: 0 }}
    >
      {children}
    </motion.div>
  );
};

const AnimateContainer: React.FC = ({ children }) => (
  <motion.div
    className="container"
    variants={container}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);

const AnimateItem: React.FC<{ key: string }> = ({ key, children }) => (
  <motion.div key={key} className="item" variants={item}>
    {children}
  </motion.div>
);

export default { Animate, AnimateContainer, AnimateItem };
