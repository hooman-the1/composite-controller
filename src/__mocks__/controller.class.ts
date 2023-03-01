import { injectable } from "inversify";
import { Conductor } from "../controller.interface";


@injectable()
abstract class ControllerBase implements Conductor {

    children: Conductor[] = [];
    name: string = "";

    add(controller: Conductor): Error | void {
        throw new Error("This is not a composite endpoint")
    };

}

@injectable()
export class ControllerClass extends ControllerBase {
    constructor(public name: string){
        super();
    }

    add(controller: Conductor): void | Error {
        this.children.push(controller);        
    }
}
