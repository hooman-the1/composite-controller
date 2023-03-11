
import "reflect-metadata";
import { ControllerClass } from "./controller.class.js";
import { Conductor } from "./controller.interface.js";
import { Controller } from "./controller.js";
import { ControllerType } from "./injector/injector-types.js";
import { container } from "./injector/injector.js";

jest.mock("./controller.class");
const controllerDecorator = Controller;

describe("Controller decorator", () => {
    const endPoint = "/v1/courses/single";
    let conductors: Conductor[];
    let v1: Conductor;
    let v1Courses: Conductor;
    let v1CoursesSingle: Conductor;
    let v2: Conductor;
    let v2Courses: Conductor;
    let v2Tests: Conductor;
    let v3: Conductor;
    let v3Test1: Conductor;
    let v3Courses: Conductor;
    let v3Test3: Conductor;

    beforeEach(() => {
        controllerDecorator("/v1");
        controllerDecorator("/v1/courses");
        controllerDecorator("/v2/courses");
        controllerDecorator("/v2/tests");
        controllerDecorator("/v3/test1/courses/test3");
        controllerDecorator("/v3/test1");
        controllerDecorator(endPoint);
        conductors = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);
        v1 = conductors.find(element => element.name === "v1")!;
        v1Courses = v1?.children[0];
        v1CoursesSingle = v1Courses?.children[0];
        v2 = conductors.find(element => element.name === "v2")!;
        v2Courses = v2?.children.find(element => element.name === "courses")!;
        v2Tests = v2?.children.find(element => element.name === "tests")!;
        v3 = conductors.find(element => element.name === "v3")!;
        v3Test1 = v3?.children[0];
        v3Courses = v3Test1?.children[0];
        v3Test3 = v3Courses?.children[0];
    })

    afterEach(() => {
        container.unbindAll();
    })

    it(`should create all nodes in tree structure 
        and ignore nodes that already created`, () => {
        expect(conductors.length).toEqual(10);
    })

    it(`should add children nodes in "children" property of nodes`, () => {
        console.log(v1Courses.children)
        expect(v1.children.length).toEqual(1);
        expect(v1Courses.children.length).toEqual(1);
        expect(v1CoursesSingle.children.length).toEqual(0);
        
        expect(v2.children.length).toEqual(2);
        expect(v2Courses.children.length).toEqual(0);
        expect(v2Tests.children.length).toEqual(0); 
        
        expect(v3.children.length).toEqual(1);
        expect(v3Test1.children.length).toEqual(1);
        expect(v3Courses.children.length).toEqual(1);
        expect(v3Test3.children.length).toEqual(0);
    })
})