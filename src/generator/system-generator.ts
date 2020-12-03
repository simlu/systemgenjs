import IGeneratorPart from "../interfaces/generator-part";
import StellaData from "./part/stella-data";
import System from "../components/system";

export default class SystemGenerator {
    randomRange: (min:number, max: number) => number;
    parts: IGeneratorPart[] = [];
    constructor(callback: (min:number, max: number) => number) {
        this.randomRange = callback;
        this.addGeneratorPart(new StellaData());
    }
    generate() {
        let system = new System();
        this.parts.forEach((part)=>{
            system = part.run(system);
        });
        return system;
    }
    addGeneratorPart(part:IGeneratorPart):void {
        part.setRandomRange(this.randomRange);
        this.parts.push(part);
    }
}
