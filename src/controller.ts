import { Conductor } from "./controller.interface";
import { container } from "./injector/injector.js";
import { ControllerType } from "./injector/injector-types.js";
import { ControllerClass } from "./controller.class.js";

type Node = { name: string; depth: number; }

export function Controller(endpoint: string) {
    let nodes = createArrayOfNodesWithoutExistedOnes(endpoint);
    try {
        createNode(nodes);
        addChildNodes(endpoint);
    } catch (error) {
        return error;
    }
}

function createArrayOfNodesWithoutExistedOnes(endpoint: string): Node[] {
    let nodes = convertEndpointToArray(endpoint);
    const existedNodes = (container.isBound(ControllerType.Conductor))
        ? createStringArrayOfExistedNodes()
        : []
    if (existedNodes.length !== 0) nodes = removeExistedNodesFromNodesArray(existedNodes, nodes);
    return nodes;
}

function removeExistedNodesFromNodesArray(existedNodes: Node[], stringNodes: Node[]): Node[] {
    for (let i = 0; i < existedNodes.length; i++) {
        const levelNodes = existedNodes.filter(node => node.depth === i).map(node => node.name);
        if (!stringNodes[0] || !levelNodes.includes(stringNodes[0].name)) break;
        stringNodes.shift();
    }
    return stringNodes;
}

function convertEndpointToArray(endpoint: string): Node[] {
    const nodesArray = endpoint.split("/");
    if (nodesArray[0] === "") nodesArray.shift();
    const modifiedNodesArray = nodesArray.map((element, index) => { return { name: element, depth: index } })
    return modifiedNodesArray;
}

function createNode(nodes: Node[]): void | Error {
    try {
        for (let node of nodes) {
            container.bind<Conductor>(ControllerType.Conductor)
                .toDynamicValue(function () {
                    return new ControllerClass(node.name, node.depth);
                }).inSingletonScope();
        }
    } catch (error) {
        throw new Error("can't create endpoint nodes")
    }
}

function addChildNodes(endPoint: string): void {
    const nodesArray = convertEndpointToArray(endPoint);
    const nodes = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);
    const firstLevelNodes = nodes.filter(node => node.depth === 0);
    const node = firstLevelNodes.find(firstLevelNode => firstLevelNode.name === nodesArray[0].name);
    const child = nodes.filter(node => node.depth === 1).find(node => node.name === nodesArray[1].name);
    let numerator = 1;
    while(numerator <= nodesArray.length){

    }
    for (let i = 0; i < nodesArray.length - 1; i++) {
        




        const levelNodesNames = nodes.filter(node => node.depth === i).map(node => node.name);
        if (!levelNodesNames.includes(nodes[i].name)) throw new Error("can't create endpoint tree");
        if (!nodes[i].children.includes(nodes[i + 1])) nodes[i].addChildren(nodes[i + 1])
    }
    // for (let i = 0; i < nodes.length - 1; i++) {
    //     if (!nodes[i].children.includes(nodes[i + 1])) nodes[i].addChildren(nodes[i + 1]);
    // }
}

function createStringArrayOfExistedNodes(): Node[] {
    const conductors = container.getAll<Conductor>(ControllerType.Conductor);
    const sortedConductors = conductors.sort((a, b) => a.depth - b.depth);
    return sortedConductors.map((element: Conductor) => { return { name: element.name, depth: element.depth } });
}


