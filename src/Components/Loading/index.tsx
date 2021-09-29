import { CircularProgress } from "@mui/material";
import React from "react";

const Loading: React.FC = () => {
  return (
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
      <CircularProgress
        color="primary"
        style={{
          padding: 5,
          margin: 10,
          lineHeight: 20,
          fontWeight: "bold",
          fontSize: "2em",
          textAlign: "center",
        }}
      />
    </div>
  );
};

export default Loading;
