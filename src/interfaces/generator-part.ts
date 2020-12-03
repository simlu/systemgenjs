import System from "../components/system";

export default interface IGeneratorPart {
    rr: (min:number, max: number) => number;
    setRandomRange(callback: (min:number, max:number) => number):IGeneratorPart;
    run(system: System): System;
}
