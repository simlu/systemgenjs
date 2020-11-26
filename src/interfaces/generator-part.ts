import System from "../components/system";

export default interface IGeneratorPart {
    setRoller(callback: (rollFormat: string) => number):void;
    run(system: System): System;
}
