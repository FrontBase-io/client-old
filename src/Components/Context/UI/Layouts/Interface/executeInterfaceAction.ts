import { findLast, reject } from "lodash";
import { AppContext } from "../../..";
import { InterfaceActionStepType } from "../../../../../Utils/Types";
//@ts-ignore
import Formula from "frontbase-formulas";

const executeInterfaceActions = (
  context: AppContext,
  interfaceActions: {
    description?: string;
    actions: InterfaceActionStepType[];
  },
  vars: { [key: string]: any }
) =>
  new Promise(async (resolve, reject) => {
    let currentEdge = findLast(
      interfaceActions.actions,
      //@ts-ignore
      (o) => o.source === "input"
    )!;
    let currentNode = findLast(
      interfaceActions.actions,
      //@ts-ignore
      (o) => o.id === currentEdge.target
    )!;
    while (currentNode.type !== "output") {
      await executeNode(context, currentNode, vars);
      currentEdge = findLast(
        interfaceActions.actions,
        //@ts-ignore
        (o) => o.source === currentNode.id
      )!;
      currentNode = findLast(
        interfaceActions.actions,
        //@ts-ignore
        (o) => o.id === currentEdge.target
      )!;
    }
  });

export default executeInterfaceActions;

const executeNode = async (
  context: AppContext,
  node: InterfaceActionStepType,
  vars: { [key: string]: any }
) =>
  new Promise<void>(async (resolve) => {
    if (node.type === "default") {
      switch (node.data.type) {
        case "create_objects":
          // Create an object
          if (node.data.args?.mode === "m") {
            // First resolve all the formulas
            const newObject = node.data.args?.newObject!;

            //@ts-ignore
            await Object.keys(newObject).reduce(async (prev, curr) => {
              await prev;

              if (newObject[curr]._form) {
                // Compile formula
                const formula = new Formula(newObject[curr]._form);
                await formula.onParsed;
                newObject[curr] = await formula.parse(vars);
              }

              return curr;
            }, Object.keys(newObject)[0]);

            await context.data.objects.create(
              node.data.args?.model!,
              newObject
            );
          }
          if (node.data.args?.mode === "v") {
            console.log("Variable");
          }
          break;
        default:
          reject(`unknown-type-${node.data.type}`);
          break;
      }
    }

    resolve();
  });
