import Star from "./star";

export default class Orbit<T> {
    constructor(item:T, type:number) {
        this.item = item;
        this.type = type;
    }
    item: T;
    sep: number = -1;
    type: number;
    ecc;
    orbits:Orbit<any>[] = [];
}
