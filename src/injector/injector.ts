import "reflect-metadata";
import { Container } from "inversify";
import { EndPointStore } from "../endpoint-repository.interface";
import { ControllerType } from "./injector-types";
import { EndPointRepository } from "../endpoint-repository";

export const container = new Container();
container.bind<EndPointStore>(ControllerType.EndPointStore).to(EndPointRepository).inSingletonScope();