import { injectable } from "inversify";
import { Conductor } from "./controller.interface";

@injectable()
abstract class ControllerBase implements Conductor {

    children: Conductor[] = [];

    constructor(public name: string, public depth: number){}

    addChildren(controller: Conductor): Error | void {
        this.children.push(controller);
    };

}

@injectable()
export class Controller extends ControllerBase {
}

