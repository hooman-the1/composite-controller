import { Response } from "express";
export interface Conductor{
    children: Conductor[];
    name: string;
    add(controller: Conductor): void;
}