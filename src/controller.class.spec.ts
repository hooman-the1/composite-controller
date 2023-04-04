import { container } from "./injector/injector.js";
import { Controller } from "./controller.class.js";
import { Conductor } from "./controller.interface";
import { ControllerType } from "./injector/injector-types.js";

describe("Controller class", () => {
    describe("addChildren function",() => {
        let conductorObject: Conductor;
        beforeEach(() => {
            const conductor1 = new Controller("test1", 11);
            container.bind<Conductor>(ControllerType.Conductor).toDynamicValue( () => {
                return conductor1;  
            }).inSingletonScope()
            conductorObject = container.get<Controller>(ControllerType.Conductor);
        })
        
        afterEach(() => {
            container.unbindAll();
        })
        
        it(`should push its argument to
        children property`, () => {
                const conductor2: Conductor = new Controller("test2", 22);
                const conductors: Conductor[] = container.getAll<Conductor>(ControllerType.Conductor)
                container.bind<Conductor>(ControllerType.Conductor).toDynamicValue( () => {
                    return conductor2;  
                }).inSingletonScope()
                const conductorObject2: Conductor = conductors.find((element) => element.name === "test2")!
                conductorObject.addChildren(conductorObject2);

                expect(conductorObject.children).toEqual([conductorObject2]); 
        })
    })
})