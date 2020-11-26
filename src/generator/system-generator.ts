import IGeneratorPart from "../interfaces/generator-part";
import StellaData from "./part/stella-data";
import System from "../components/system";

export default class SystemGenerator {
    roller: (rollFormat: string) => number;
    parts: IGeneratorPart[] = [];
    constructor(callback: (rollFormat: string) => number) {
        this.roller = callback;
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
        part.setRoller(this.roller);
        this.parts.push(part);
    }
}
