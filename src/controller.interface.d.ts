import { Response } from "express";
export interface Conductor{
    children: Conductor[];
    name: string;
    depth: number;
    addChildren(controller: Conductor): void;
}