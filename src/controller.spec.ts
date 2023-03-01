
import { ControllerClass} from "./controller.class.js";
import { Conductor } from "./controller.interface.js";
import { Controller } from "./controller.js";
import { ControllerType } from "./injector/injector-types.js";
import { container } from "./injector/injector.js";

jest.mock("./controller.class");
const controllerInjector = Controller;

describe("Controller decorator", () => {
    const endPoint = "/v1/courses/single";
    const nodesArray = ["v1", "courses", "single"];

    beforeEach(() => {
    })

    afterEach(() => {
        container.unbindAll();
    })

    it(`should create 3 nodes with their names based on nodes array elements`, () => {
        controllerInjector(endPoint);
        expect(container.getAll<Conductor>(ControllerType.Conductor).length).toBe(3);
    })

    it(`should create tree by adding child instance to its parent children property`, () => {
        controllerInjector(endPoint);
        const conductors = container.getAll<Conductor>(ControllerType.Conductor);
        console.log(conductors);
        expect(conductors[0].children[0]).toEqual(conductors[1]);
        expect(conductors[0].children[0].name).toEqual("courses");
        expect(conductors[1].children[0]).toEqual(conductors[2]);
        expect(conductors[1].children[0].name).toEqual("single");
        expect(conductors[2].children.length).toBe(0);
    })
})