import pkg from 'dice-utils';
import SystemGenerator from "./generator/system-generator";
const {roll} = pkg;

let systemGenerator = new SystemGenerator((rollFormat:string) => {
    return roll(rollFormat).total;
});

console.log(JSON.stringify(systemGenerator.generate()));
