import { Controller } from "./controller.class.js";
import { Conductor } from "./controller.interface";
import { ControllerType } from "./injector/injector-types.js";
import { container } from "./injector/injector.js";

describe("Controller class", () => {
    describe("addChildren function",() => {
        let conductorObject: Conductor;
        beforeEach(() => {
            const conductor = new Controller("test", 11);
            container.bind<Conductor>(ControllerType.Conductor).toDynamicValue( () => {
              return conductor;  
            }).inSingletonScope()
            conductorObject = container.get<Controller>(ControllerType.Conductor);
        })

        afterEach(() => {
            container.unbindAll();
        })
        it(`should push its argument to
            children property`, () => {
            
        })
    })
})