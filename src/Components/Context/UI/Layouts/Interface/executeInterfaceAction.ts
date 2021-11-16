import { cloneDeep, findLast, map, reject } from "lodash";
import { AppContext } from "../../..";
import {
  InterfaceActionStepType,
  InterfaceobjectVariableType,
} from "../../../../../Utils/Types";
//@ts-ignore
import Formula from "frontbase-formulas";

const executeInterfaceActions = (
  context: AppContext,
  interfaceActions: {
    description?: string;
    actions: InterfaceActionStepType[];
  },
  variables: { [key: string]: any },
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void
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
      await executeNode(context, currentNode, variables, setVariables);
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
  variables: { [key: string]: any },
  setVariables: (variables: {
    [key: string]: InterfaceobjectVariableType;
  }) => void
) =>
  new Promise<void>(async (resolve) => {
    if (node.type === "default") {
      switch (node.data.type) {
        case "create_objects":
          // Create an object
          if (node.data.args?.mode === "m") {
            // First resolve all the formulas
            const newObject = cloneDeep(node.data.args?.newObject!);

            //@ts-ignore
            await Object.keys(newObject).reduce(async (prev, curr) => {
              await prev;

              if (newObject[curr]._form) {
                // Compile formula
                const formula = new Formula(newObject[curr]._form);
                await formula.onParsed;
                newObject[curr] = await formula.parse(variables);
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
        case "assign_values":
          await Object.keys(node.data.args?.values || {}).reduce(
            //@ts-ignore
            async (prev, curr) => {
              await prev;
              if (curr === "currentInputValue") {
                // This is an exception. If we have the current input's value we need to call a state change instead
                variables["setCurrentInputValue"](
                  node.data.args!.values!.currentInputValue
                );
              } else {
                console.log("Todo: assign value", curr);
              }
              return curr;
            },
            Object.keys(node.data.args?.values || {})[0]
          );

          break;
        default:
          reject(`unknown-type-${node.data.type}`);
          break;
      }
    }

    resolve();
  });
