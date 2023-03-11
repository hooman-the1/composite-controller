import { injectable } from "inversify";
import { Conductor } from "../controller.interface";


@injectable()
abstract class ControllerBase implements Conductor {

    children: Conductor[] = [];
    name: string = "";
    depth: number = 0;

    addChildren(controller: Conductor): Error | void {
        throw new Error("This is not a composite endpoint")
    };

    addDepthLevel(depth: number): void {
        this.depth = depth;
    };

}

@injectable()
export class ControllerClass extends ControllerBase {
    constructor(public name: string, public depth: number){
        super();
    }

    addChildren(controller: Conductor): void | Error {
        this.children.push(controller);        
    }
}
