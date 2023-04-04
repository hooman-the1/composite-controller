import "reflect-metadata";
import { Controller } from "./controller.class.js";
import { Conductor } from "./controller.interface.js";
import { registerController } from "./register-controller.js";
import { ControllerType } from "./injector/injector-types.js";
import { container } from "./injector/injector.js";
import { EndPointStore } from "./endpoint-repository.interface.js";

jest.mock("./controller.class");
jest.mock("./endpoint-repository");
const controllerDecorator = registerController;
const endPointRepo: EndPointStore = container.get<EndPointStore>(ControllerType.EndPointStore);

describe("Controller decorator", () => {
  const endPoint = "/v1/courses/single";
  let conductors: Conductor[];
  let v1, v1Courses, v1CoursesSingle, v2, v2Courses, v2Tests, v3, v3Test1, v3Test1Courses, v3Test1CoursesTest3: Conductor;

  afterEach(() => {
    container.unbindAll();
    endPointRepo.clear();
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
    expect(conductors.length).toEqual(11);
  });

  it(`should add children nodes in "children" property of nodes`, () => {
    controllerDecorator("/v1");
    controllerDecorator("v1/courses");
    controllerDecorator("/v2/courses");
    controllerDecorator("/v2/tests");
    controllerDecorator("/v3/test1/courses/test3");
    controllerDecorator("/v3/test1");
    controllerDecorator(endPoint);
    conductors = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);

    const root = conductors.find((element) => element.name === "")!;

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

    expect(root.children.length).toEqual(3);
    expect(root.children).toEqual([v1, v2, v3]);

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

  it(`should add parent nodes in "parent" property of nodes`, () => {
    controllerDecorator("/v1");
    controllerDecorator("v1/courses");
    controllerDecorator("/v2/courses");
    controllerDecorator("/v2/tests");
    controllerDecorator("/v3/test1/courses/test3");
    controllerDecorator("/v3/test1");
    controllerDecorator(endPoint);
    conductors = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);

    const root = conductors.find((element) => element.name === "")!;

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

    expect(root.parent).toEqual(null);
    expect(v1.parent).toEqual(root);
    expect(v1Courses.parent).toEqual(v1);
    expect(v2.parent).toEqual(root);
    expect(v2Courses.parent).toEqual(v2);
    expect(v3.parent).toEqual(root);
    expect(v3Test1.parent).toEqual(v3);
    expect(v3Test1Courses.parent).toEqual(v3Test1);
    expect(v3Test1CoursesTest3.parent).toEqual(v3Test1Courses);
  });

  it(`should throw an error with text
      "duplicate endpoint", when 2 exact same endpoint added`, () => {
    controllerDecorator("/v40/test1/courses/test3");

    expect(() => controllerDecorator("v40/test1/courses/test3")).toThrow("duplicate endpoint");
  });

  it(`should throw an error with text
      "duplicate endpoint", when "" and "/" as 
      seperate endpoints added`, () => {
    controllerDecorator("/");

    expect(() => controllerDecorator("")).toThrow("duplicate endpoint");
  });

  it(`should treat empty or "/" endpoint 
      as root of all other endpoints`, () => {
    controllerDecorator("/v40/test1/courses/test3");
    controllerDecorator("/");
    conductors = container.getAll<Conductor>(ControllerType.Conductor).sort((a, b) => a.depth - b.depth);
    const root = conductors.find((element) => element.name === "")!;
    const rootV40 = conductors.find((element) => element.name === "v40")!;
    expect(root.children.length).toEqual(1);
    expect(root.children).toEqual([rootV40]);
  });

  it(`should ignore query params
      and treat endpoints with different query params 
      as same endpoints`, () => {
    controllerDecorator("/v40?t=10");
    
    expect(() => controllerDecorator("/v40?t=20")).toThrow("duplicate endpoint");
  });

  it(`should ignore route params
      and treat endpoints with different route params 
      as same endpoints`, () => {
    controllerDecorator("/v40/:test1/etc");
    
    expect(() => controllerDecorator("/v40/:test2/etc")).toThrow("duplicate endpoint");
  });
});
