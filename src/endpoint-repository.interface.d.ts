export interface EndPointStore{
    add(endPoint: string): void;
    check(endPoint: string): true | false;
    list(): string[];
    clear(): void;
}