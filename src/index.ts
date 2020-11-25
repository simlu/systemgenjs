import StellaData from "./lib/stella-data";
import pkg from 'dice-utils';
const {roll} = pkg;

let gen = new StellaData((rollFormat:string) => {
    return roll(rollFormat).total;
});
console.log(JSON.stringify(gen.run()));
