import { injectable } from "inversify";
import { EndPointStore } from "./endpoint-repository.interface";

@injectable()
export class EndPointRepository implements EndPointStore{
    private endPoints: string[] = [];
    
    add(endPoint: string): void {

    }

    check(endPoint: string): true | false{
        return false;
    }

    list(): string[]{
        return [];
    }

    clear(){
        return
    }
}