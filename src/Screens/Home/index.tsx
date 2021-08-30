import React from "react";
import Card from "../../Components/Design/Card";
import { Animate } from "../../Components/Design/Animations";

const HomeScreen: React.FC = () => {
  return (
    <Animate>
      <Card title="Home page">This will soon be a nice grid of widgets.</Card>
    </Animate>
  );
};

export default HomeScreen;
