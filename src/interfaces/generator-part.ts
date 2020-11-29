import System from "../components/system";

export default interface IGeneratorPart {
    setRoller(callback: (rollFormat: string) => number):IGeneratorPart;
    run(system: System): System;
}
