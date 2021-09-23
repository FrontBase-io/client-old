import React from "react";
import { AppContext } from "../../../..";
import { LayoutItemType } from "../../../../../../Utils/Types";
import AnimationContainer from "./AnimationContainer";
import AnimationItem from "./AnimationItem";
import Card from "./Card";
import GridContainer from "./GridContainer";
import GridItem from "./GridItem";

const LayoutComponents: {
  [key: string]: React.FC<{ context: AppContext; layoutItem: LayoutItemType }>;
} = {
  GridContainer,
  GridItem,
  AnimationContainer,
  AnimationItem,
  Card,
};

export default LayoutComponents;
