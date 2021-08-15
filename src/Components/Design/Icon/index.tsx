import React from "react";

const Icon: React.FC<{ icon: string }> = ({ icon }) => {
  return <span className="material-icons-round">{icon}</span>;
};

export default Icon;
