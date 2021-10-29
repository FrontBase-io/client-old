import { motion } from "framer-motion";
import LightLogo from "./light.png";
import DarkLogo from "./dark.png";

const FrontBaseLoader: React.FC = () => (
  <div
    style={{
      height: "100%",
      padding: 0,
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "wait",
    }}
  >
    <motion.div
      animate={{ scale: 1.05 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
    >
      {window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches ? (
        <img
          src={DarkLogo}
          alt="Loading indicator"
          style={{ width: 150, height: 150 }}
        />
      ) : (
        <img
          src={LightLogo}
          alt="Loading indicator"
          style={{ width: 150, height: 150 }}
        />
      )}
    </motion.div>
  </div>
);

export default FrontBaseLoader;
