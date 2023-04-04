import { injectable } from "inversify";
import { Conductor } from "./controller.interface";

@injectable()
abstract class ControllerBase implements Conductor {

    children: Conductor[] = [];
    parent: Conductor | null = null;

    constructor(public name: string, public depth: number){}

    addChildren(controller: Conductor): Error | void {
        this.children.push(controller);
    };

    addParent(controller: Conductor): void {
        
    }

}

@injectable()
export class Controller extends ControllerBase {
}

