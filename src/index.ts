import pkg from 'dice-utils';
import SystemGenerator from "./generator/system-generator";
import MultipleStars from "./generator/part/multiple-stars";
import PlanetaryOrbits from "./generator/part/planetary-orbits";
const {roll} = pkg;

const roller = (rollFormat:string) => {
    return roll(rollFormat).total;
};
let systemGenerator = new SystemGenerator(roller);

systemGenerator.addGeneratorPart((new MultipleStars()).setRoller(roller));
systemGenerator.addGeneratorPart((new PlanetaryOrbits()).setRoller(roller));

let result = systemGenerator.generate();
console.log(JSON.stringify(result));
