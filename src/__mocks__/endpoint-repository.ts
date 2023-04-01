import { injectable } from "inversify";
import { EndPointStore } from "../endpoint-repository.interface";

@injectable()
export class EndPointRepository implements EndPointStore{
    private endPoints: string[] = [];
    
    add(endPoint: string): void {
        this.endPoints.push(endPoint);
    }

    check(endPoint: string): true | false{
        if(this.endPoints.includes(endPoint)) return true
        return false
    }

    list(): string[]{
        return [];
    }

    clear(): void{
        this.endPoints = [];
    }
}