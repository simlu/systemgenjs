import SystemGenerator from "./generator/system-generator";
import MultipleStars from "./generator/part/multiple-stars";
import PlanetaryOrbits from "./generator/part/planetary-orbits";
import Srand from 'seeded-rand';
import LunarOrbits from "./generator/part/lunar-orbits";

const rnd = new Srand(); // Initiate with random seed

console.log(rnd.seed()); // 1836504610 Read the seed

const randomRangeGenerator = (min: number, max: number) => {
    return rnd.intInRange(min, max);
};
let systemGenerator = new SystemGenerator(randomRangeGenerator);

systemGenerator.addGeneratorPart((new MultipleStars()).setRandomRange(randomRangeGenerator));
systemGenerator.addGeneratorPart((new PlanetaryOrbits()).setRandomRange(randomRangeGenerator));
systemGenerator.addGeneratorPart((new LunarOrbits()).setRandomRange(randomRangeGenerator));

let result = systemGenerator.generate();
console.log(JSON.stringify(result));
