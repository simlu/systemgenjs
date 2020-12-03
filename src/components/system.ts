import {Abundance} from "../tables/stella-data-tables";
import Star from "./star";

export default class System {
    public age: number = 0;
    public abundance: Abundance = new Abundance();
    public orbits: Star[] = [];
    public starPaths: string[] = [];
}
