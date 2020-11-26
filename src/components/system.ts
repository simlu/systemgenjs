import Orbit from "./orbit";
import {Abundance} from "../tables/stella-data-tables";

export default class System {
    public age:number = 0;
    public abundance: Abundance = new Abundance();
    public primary: Orbit<any>[] = [];
}
