import StellaData from "../stella-data";
import pkg from 'dice-utils';
const {roll} = pkg;

test(
    'Check initial star gen', () => {
        let gen = new StellaData((f) => {
           throw "Should not be called in this test";
        });
        let gs = gen.initialStarGen(99, 8);
        expect(gs.spectralClass).toBe("F");
        expect(gs.sizeClass).toBe("IV");
    },
);

test(
    'Check star qty average', () => {
        let gen = new StellaData((rollFormat:string) => {
            return roll(rollFormat).total;
        });
        let count = 0;
        let sum = 0;
        for(let i=0; i < 1000; i++) {
            sum += gen.starQty();
            count++;
        }
        let avg = sum/count;
        expect(avg).toBeLessThan(4);
    },
);
