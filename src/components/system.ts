import Star from "./star";

export default class System {
    public age:number = 0;
    public abundance: string = "Normal";
    public stars: Star[] = [];
    public orbits = [];
}
