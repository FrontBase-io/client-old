import React from "react";
import { AppContext } from "../../../..";
import {
  LayoutItemType,
  ModelType,
  ObjectType,
} from "../../../../../../Utils/Types";
import Animation from "./Animation";
import AnimationContainer from "./AnimationContainer";
import AnimationItem from "./AnimationItem";
import Card from "./Card";
import Field from "./Field";
import GridContainer from "./GridContainer";
import GridItem from "./GridItem";
import RelatedItem from "./RelatedItem";

export interface LayoutComponentPropType {
  context: AppContext;
  layoutItem: LayoutItemType;
  model: ModelType;
  object?: ObjectType;
  newObject?: ObjectType;
  viewMode: "view" | "edit";
  selectedField?: string;
  selectField: (fieldName: string) => void;
  updateField: (key: string, newValue: any) => void;
}

const LayoutComponents: {
  [key: string]: React.FC<LayoutComponentPropType>;
} = {
  GridContainer,
  GridItem,
  AnimationContainer,
  AnimationItem,
  Card,
  Field,
  Animation,
  RelatedItem,
};

export default LayoutComponents;
