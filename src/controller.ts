import { Conductor } from "./controller.interface";
import { container } from "./injector/injector.js";
import { ControllerType } from "./injector/injector-types.js";
import { ControllerClass } from "./controller.class.js";

type Node = { name: string; depth: number };

export async function Controller(endPoint: string) {
  let nodes = createArrayOfNodesWithoutExistedOnes(endPoint);
  createNodeTree(nodes, endPoint);
}

function createArrayOfNodesWithoutExistedOnes(endPoint: string): Node[] {
  let nodes = convertEndpointToArray(endPoint);
  const existedNodes = container.isBound(ControllerType.Conductor) ? createStringArrayOfExistedNodes() : [];
  if (existedNodes.length !== 0) nodes = removeExistedNodesFromNodesThatShouldCreate(existedNodes, nodes);
  return nodes;
}

function removeExistedNodesFromNodesThatShouldCreate(existedNodes: Node[], stringNodes: Node[]): Node[] {
  for (let i = 0; i < existedNodes.length; i++) {
    const levelNodes = existedNodes.filter((node) => node.depth === i).map((node) => node.name);
    if (!stringNodes[0] || !levelNodes.includes(stringNodes[0].name)) break;
    stringNodes.shift();
  }
  return stringNodes;
}

function convertEndpointToArray(endPoint: string): Node[] {
  const nodesArray = endPoint.split("/");
  if (nodesArray[0] === "") nodesArray.shift();
  const modifiedNodesArray = nodesArray.map((element, index) => {
    return { name: element, depth: index };
  });
  return modifiedNodesArray;
}

function createNodeTree(nodes: Node[], endPoint: string): void | Error {
  try {
    createNodTreeTryBlock(nodes, endPoint);
  } catch (error) {
    throw new Error("can't create endpoint nodes");
  }
}

function createNodTreeTryBlock(nodes: Node[], endPoint: string) {
  let childConductor: Conductor;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const conductor = new ControllerClass(nodes[i].name, nodes[i].depth);
    container
      .bind<Conductor>(ControllerType.Conductor)
      .toDynamicValue(function () {
        if (i !== nodes.length - 1) conductor.addChildren(childConductor);
        childConductor = conductor;
        return conductor;
      })
      .inSingletonScope();
  }
  const endPointsArray = convertEndpointToArray(endPoint);
  if(nodes.length === 0) return
  const depthForAddChild = nodes[0].depth - 1;
  if(depthForAddChild === -1) return
  const conductors = container.getAll<Conductor>(ControllerType.Conductor);
  let parentConductor = conductors
      .find((element) => element.depth === 0 
        && element.name === endPointsArray[0].name)!;
  let i = 1
  while(parentConductor.depth < depthForAddChild){
    parentConductor = parentConductor.children.find((element) => element.name === endPointsArray[i].name)!
    i ++;
  }
  parentConductor.addChildren(childConductor!);
}

function createStringArrayOfExistedNodes(): Node[] {
  const conductors = container.getAll<Conductor>(ControllerType.Conductor);
  const sortedConductors = conductors.sort((a, b) => a.depth - b.depth);
  return sortedConductors.map((element: Conductor) => {
    return { name: element.name, depth: element.depth };
  });
}
