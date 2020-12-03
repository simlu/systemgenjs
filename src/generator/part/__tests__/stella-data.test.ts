import StellaData from "../stella-data";
import Srand from 'seeded-rand';

test(
    'Check initial star gen', () => {
        let gen = new StellaData();
        gen.setRandomRange((min: number, max: number) => {
            throw "Should not be called in this test";
        });
        let gs = gen.initialStarGen(99, 8);
        expect(gs.spectralClass).toBe("F");
        expect(gs.sizeClass).toBe("IV");
    },
);

test(
    'Check star qty average', () => {
        let gen = new StellaData();
        let rnd = new Srand(); // Initiate with random seed
        let randomRangeGenerator = (min: number, max: number) => {
            return rnd.intInRange(min, max);
        };
        gen.setRandomRange(randomRangeGenerator);
        let count = 0;
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
            sum += gen.starQty(10);
            count++;
        }
        let avg = sum / count;
        expect(avg).toBeLessThan(4);
    },
);
