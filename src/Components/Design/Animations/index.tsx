import React from "react";
import { motion } from "framer-motion";

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

export default { Animate };
