import { Response } from "express";
export interface Conductor{
    children: Conductor[];
    name: string;
    depth: number;
    parent: Conductor | null;
    addChildren(controller: Conductor): void;
    addParent(controller: Conductor): void;
}