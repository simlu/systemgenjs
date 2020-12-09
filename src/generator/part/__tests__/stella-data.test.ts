import StellaData from "../stella-data";
import Srand from 'seeded-rand';
import {
    Abundance,
    abundances,
    LumMassTempRad,
    lumMassTempRads,
    starAges,
    StarMap,
    starMaps
} from "../../../tables/stella-data-tables";

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

test(
    'Check setLumMassTempRad', () => {
        let gen = new StellaData();
        let map = new StarMap();
        let randomRangeGenerator = (min: number, max: number) => {
            throw "Used Random when it shouldn't";
        };
        gen.setRandomRange(randomRangeGenerator);

        lumMassTempRads.forEach((value) => {
            map.spectralClass = value.spectralClass;
            map.sizeClass = value.sizeClass;
            for (let i = 1; i <= 10; i++) {
                map.spectralRanking = i;
                let actual = gen.setLumMassTempRad(map);
                expect(actual.lum).toBe(value.lum[i]);
                expect(actual.temp).toBe(value.temp[i]);
                expect(actual.mass).toBe(value.mass[i]);
                expect(actual.rad).toBe(value.rad[i]);
            }
        })
    },
);

test(
    'Check findStarMap', () => {
        let gen = new StellaData();
        let map = new StarMap();
        let randomRangeGenerator = (min: number, max: number) => {
            throw "Used Random when it shouldn't";
        };
        gen.setRandomRange(randomRangeGenerator);

        starMaps.forEach((value) => {

            for (let i = value.min; i <= value.max; i++) {
                let actual = gen.findStarMap(i);
                expect(actual.spectralClass).toBe(value.spectralClass);
                expect(actual.sizeClass).toBe(value.sizeClass);
                expect(actual.starDesc).toBe(value.starDesc);
                expect(actual.sizeClass).toBe(value.sizeClass);
                expect(actual.specTarget).toBe(value.specTarget);
            }
        })
    },
);

test(
    'Check findStarAge', () => {
        let gen = new StellaData();
        let map = new StarMap();
        let randomRangeGenerator = (min: number, max: number) => {
            throw "Used Random when it shouldn't";
        };
        gen.setRandomRange(randomRangeGenerator);

        starAges.forEach((value) => {
            map.spectralClass = value.spectralClass;
            for (let i = value.minRanking; i <= value.maxRanking; i++) {
                let actual = gen.findStarAge(map, i);
                expect(actual.spectralClass).toBe(value.spectralClass);
                expect(actual.age).toBe(value.age);
                expect(actual.mod).toBe(value.mod);
                expect(actual.life).toBe(value.life);
            }
        })
    },
);

test(
    'Check findAbundance', () => {
        let gen = new StellaData();
        let roll = 1;
        let randomRangeGenerator = (min: number, max: number) => {
            return roll;
        };

        gen.setRandomRange(randomRangeGenerator);

        starAges.forEach((value) => {
            for (let i = 0; i < 10; i++) {
                let age = value.life;
                age += (value.age[i] !== undefined) ? value.age[i] : 0;
                for (let j = 2; j < 20; j++) {
                    roll = j;
                    let result = roll + age;
                    let actual = gen.findAbundance(age);
                    let desc = "";
                    let mod = 0;
                    switch(true) {
                        case (result <= 9):
                            desc = "Exceptional";
                            mod = 2;
                            break;
                        case (result <= 12):
                            desc = "High";
                            mod = 1;
                            break;
                        case (result <= 18):
                            desc = "Normal";
                            mod = 0;
                            break;
                        case (result <= 21):
                            desc = "Poor";
                            mod = -1;
                            break;
                        case (result <= 200):
                            desc = "Depleted";
                            mod = -3;
                            break;
                    }
                    expect(actual.desc).toBe(desc);
                    expect(actual.mod).toBe(mod);
                }
            }
        });
    },
);
