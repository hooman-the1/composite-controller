import { Conductor } from "./controller.interface";
import { container } from "./injector/injector.js";
import { ControllerType } from "./injector/injector-types.js";
import { Controller } from "./controller.class.js";
import { EndPointStore } from "./endpoint-repository.interface";

type Node = { name: string; depth: number };

const endPointRepo: EndPointStore = container.get<EndPointStore>(ControllerType.EndPointStore);

export function registerController(endPoint: string) {
  if(endPoint.length > 0 && endPoint.charAt(0) === "/") endPoint = endPoint.substring(1);  
  if(endPointRepo.check(endPoint)) throw new Error("duplicate endpoint")
  let nodes: Node[] = createArrayOfNodesWithoutExistedOnes(endPoint);
  createNodeTree(nodes, endPoint);
  endPointRepo.add(endPoint);
}

function createArrayOfNodesWithoutExistedOnes(endPoint: string): Node[] {
  let nodes: Node[] = convertEndpointToArray(endPoint);
  const existedNodes: Node[] = container.isBound(ControllerType.Conductor) ? createStringArrayOfExistedNodes() : [];
  if (existedNodes.length !== 0) nodes = removeExistedNodesFromNodesThatShouldCreate(existedNodes, nodes);
  return nodes;
}  

function removeExistedNodesFromNodesThatShouldCreate(existedNodes: Node[], stringNodes: Node[]): Node[] {
  for (let i = 0; i < existedNodes.length; i++) {
    const levelNodes: string[] = existedNodes.filter((node) => node.depth === i).map((node) => node.name);
    if (!stringNodes[0] || !levelNodes.includes(stringNodes[0].name)) break;
    stringNodes.shift();
  }
  return stringNodes;
}

function convertEndpointToArray(endPoint: string): Node[] {
  const nodesArray: string[] = endPoint.split("/");
  // if (nodesArray[0] === "") nodesArray.shift();
  const modifiedNodesArray: Node[] = nodesArray.map((element, index) => {
    return { name: element, depth: index };
  });
  return modifiedNodesArray;
}

function createNodeTree(nodes: Node[], endPoint: string): void | Error {
  let childConductor: Conductor;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const conductor: Controller = new Controller(nodes[i].name, nodes[i].depth);
    container.bind<Conductor>(ControllerType.Conductor).toDynamicValue( () => {
        if (i !== nodes.length - 1) conductor.addChildren(childConductor);
        childConductor = conductor;  
        return conductor;
      })
      .inSingletonScope();
  }   
  const parentConductor: Conductor | null = findLastExistedEndPoint(nodes, endPoint)
  if(parentConductor !== null) parentConductor.addChildren(childConductor!);
} 
    
function findLastExistedEndPoint(nodes: Node[], endPoint: string): Conductor | null{
  const endPointsArray: Node[] = convertEndpointToArray(endPoint);
  if(nodes.length === 0 || nodes[0].depth === 0) return null
  const depthForAddChild: number = nodes[0].depth - 1;
  return scanRelatedTreeDownward(endPointsArray, depthForAddChild)
}

function scanRelatedTreeDownward(endPointsArray: Node[], depthForAddChild: number): Conductor{
  let parentConductor: Conductor = findRootEndpoint(endPointsArray)
  let i = 1
  while(parentConductor.depth < depthForAddChild){
    parentConductor = parentConductor.children.find((element) => element.name === endPointsArray[i].name)!
    i ++;
  }
  return parentConductor;
}

function findRootEndpoint(endPointsArray: Node[]): Conductor{
  const conductors: Conductor[] = container.getAll<Conductor>(ControllerType.Conductor);
  return conductors.find((element) => element.depth === 0 && element.name === endPointsArray[0].name)!;
}

function createStringArrayOfExistedNodes(): Node[] {
  const conductors: Conductor[] = container.getAll<Conductor>(ControllerType.Conductor);
  const sortedConductors: Conductor[] = conductors.sort((a, b) => a.depth - b.depth);
  return sortedConductors.map((element: Conductor) => {
    return { name: element.name, depth: element.depth };
  });
}
