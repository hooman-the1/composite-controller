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
  let v1, v1Courses, v1CoursesSingle, v2, v2Courses, v2Tests, v3, v3Test1, v3Test1Courses, v3Test1CoursesTest3: Conductor;

  afterEach(() => {
    container.unbindAll();
  });

  it(`should create all nodes in tree structure 
        and ignore nodes that already created`, () => {
    controllerDecorator("/v1");
    controllerDecorator("/v1/courses");
    controllerDecorator("/v2/courses");
    controllerDecorator("/v2/tests");
    controllerDecorator("/v3/test1/courses/test3");
    controllerDecorator("/v3/test1");
    controllerDecorator("/v3");
    controllerDecorator(endPoint);
    conductors = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);
    expect(conductors.length).toEqual(10);
  });

  it(`should add children nodes in "children" property of nodes`, () => {
    controllerDecorator("/v1");
    controllerDecorator("/v1/courses");
    controllerDecorator("/v2/courses");
    controllerDecorator("/v2/tests");
    controllerDecorator("/v3/test1/courses/test3");
    controllerDecorator("/v3/test1");
    controllerDecorator(endPoint);
    conductors = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);

    v1 = conductors.find((element) => element.name === "v1")!;
    v1Courses = v1?.children[0];
    v1CoursesSingle = v1Courses?.children[0];
    v2 = conductors.find((element) => element.name === "v2")!;
    v2Courses = v2?.children.find((element) => element.name === "courses")!;
    v2Tests = v2?.children.find((element) => element.name === "tests")!;
    v3 = conductors.find((element) => element.name === "v3")!;
    v3Test1 = v3?.children[0];
    v3Test1Courses = v3Test1?.children[0];
    v3Test1CoursesTest3 = v3Test1Courses?.children[0];

    expect(v1.children.length).toEqual(1);
    expect(v1.children).toEqual([v1Courses]);
    expect(v1Courses.children.length).toEqual(1);
    expect(v1Courses.children).toEqual([v1CoursesSingle]);
    expect(v1CoursesSingle.children.length).toEqual(0);
    
    expect(v2.children.length).toEqual(2);
    expect(v2.children).toEqual([v2Courses, v2Tests]);
    expect(v2Courses.children.length).toEqual(0);
    expect(v2Tests.children.length).toEqual(0);
    
    expect(v3.children.length).toEqual(1);
    expect(v3.children).toEqual([v3Test1]);
    expect(v3Test1.children.length).toEqual(1);
    expect(v3Test1Courses.children.length).toEqual(1);
    expect(v3Test1.children).toEqual([v3Test1Courses]);
    expect(v3Test1CoursesTest3.children.length).toEqual(0);
  });
});
