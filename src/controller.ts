import { Conductor } from "./controller.interface";
import { container } from "./injector/injector.js";
import { ControllerType } from "./injector/injector-types.js";
import { ControllerClass } from "./controller.class.js";

export function Controller(endpoint: string) {
    const stringNodes = convertEndpointToArray(endpoint);
    createNode(stringNodes);
    addChildNodes();
}

function convertEndpointToArray(endpoint: string): string[] {
    const nodesArray = endpoint.split("/");
    if (nodesArray[0] === "") nodesArray.shift();
    return nodesArray;
}

function createNode(nodes: string[]): void {
    for (let node of nodes) {
        container.bind<Conductor>(ControllerType.Conductor)
            .toDynamicValue(function () {
                return new ControllerClass(node);
            }).inSingletonScope();
    }
}

function addChildNodes(){
    const nodes = container.getAll<Conductor>(ControllerType.Conductor);
    for(let i = 0; i < nodes.length - 1; i++){
        nodes[i].add(nodes[i + 1]);
    }
}