import {Abundance} from "../tables/stella-data-tables";
import Star from "./star";
import BaseOrbitsType from "./base-orbits-type";

export default class System {
    public age:number = 0;
    public abundance: Abundance = new Abundance();
    public orbits: Star[] = [];
    public starPaths: string[] = [];
}
