import "reflect-metadata";
import { Container } from "inversify";

// export const controllerInjectorModule = new ContainerModule(
//     (bind) => {
//         bind<Conductor>(ControllerType.Conductor).to(Controller)
//     }
// ) 

export const container = new Container();

// container.load(
//     controllerInjectorModule
// );