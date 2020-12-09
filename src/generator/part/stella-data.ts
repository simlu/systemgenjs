import {
    Abundance,
    abundances,
    brownDwarf,
    lumMassTempRads,
    StarAge,
    starAges,
    StarMap,
    starMaps,
    whiteDwarf
} from "../../tables/stella-data-tables";
import Star from "../../components/star";
import System from "../../components/system";
import IGeneratorPart from "../../interfaces/generator-part";

export default class StellaData implements IGeneratorPart {
    rr: (min: number, max: number) => number;

    setRandomRange(callback: (min: number, max: number) => number): StellaData {
        this.rr = callback;
        return this;
    }

    run(system: System): System {
        let primaryStarMap: StarMap = this.initialStarGen(this.rr(1, 100), this.rr(1, 10));
        let qty: number = this.starQty(3);
        let maps: StarMap[] = this.extraStars(primaryStarMap, qty);
        maps = this.calculateLumMassTempRad(maps);
        maps = this.recalculateGiantAndSubGiant(maps);
        maps = this.recalculateDwarfs(maps);
        let stars: Star[];
        stars = this.convertStarMapsToStars(maps);
        system.age = stars[0].starAge;
        system.abundance = this.findAbundance(stars[0].starAge);
        system.orbits = stars;
        return system;
    }

    initialStarGen(d100: number, d10: number): StarMap {
        let match = this.findStarMap(d100);
        d10 = (d10 === 10) ? 0 : d10;
        match.spectralRanking = d10;

        if (match.specTarget > 0) {
            if (d10 >= match.specTarget) {
                match.starDesc = "SubGiant";
                match.sizeClass = "IV";
            }
        } else if (match.specTarget === -1) {
            switch (d10) {
                case 1:
                    match.spectralClass = "F";
                    break;
                case 2:
                    match.spectralClass = "G";
                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    match.spectralClass = "K";
                    break;
                case 8:
                case 9:
                case 10:
                    match.spectralClass = "F";
                    match.starDesc = "SubGiant";
                    match.sizeClass = "IV";
                    break;
            }
        }

        return match;
    }

    extraStars(primary: StarMap, qty: number): StarMap[] {
        let stars = [];
        for (let i = 0; i < qty; i++) {
            if (i === 0) {
                stars.push(primary);
            } else {
                let d10 = this.rr(1, 10);
                let d10s = this.rr(1, 10);
                if (d10s <= 2) {
                    let star = {...primary};
                    if (d10 > star.spectralRanking) {
                        star.spectralRanking = d10;
                    }
                    stars.push(star);
                } else {
                    let star = this.initialStarGen(this.rr(1, 100), this.rr(1, 10));
                    if (star.sizeClass === "VI" || star.sizeClass === "III" || primary.max < star.min) {
                        star = this.initialStarGen(87, d10);
                    }
                    stars.push(star);
                }
            }
        }

        return stars;
    }

    starQty(max: number): number {
        let stars = 1;
        let rl = this.rr(1, max);
        while (rl > 7 && stars <= 6) {
            stars++;
            rl = this.rr(1, 10);
        }

        return stars;
    }

    calculateLumMassTempRad(stars: StarMap[]): StarMap[] {
        let age = 0;
        let roll = this.rr(1, 10) - 1;
        for (let i = 0; i < stars.length; i++) {
            stars[i] = this.setLumMassTempRad(stars[i]);
            if (i === 0 && stars[i].spectralClass !== "WD" && stars[i].spectralClass !== "BD" && stars[i].sizeClass !== "III" && stars[i].sizeClass !== "IV") {
                let adj = this.findStarAge(stars[i], roll);
                let ageKeyExists = (roll in adj.age);
                let modKeyExists = (roll in adj.mod);
                let modifier = modKeyExists ? adj.mod[roll] : 0;
                age = ageKeyExists ? adj.life + adj.age[roll] : adj.life;
                age = Math.ceil(age);
                stars[i].lum += (stars[i].lum / 100) * modifier;
            }
            if (age !== 0 && stars[i].starAge === 0) {
                stars[i].starAge = age;
            }
        }

        return stars;
    }

    recalculateGiantAndSubGiant(stars: StarMap[]): StarMap[] {
        let age = 0;
        let d10 = this.rr(1, 10);
        for (let i = 0; i < stars.length; i++) {
            let mod = this.rr(1, 10);
            if (stars[i].sizeClass === "IV") {
                switch (mod) {
                    case 3:
                        stars[i].mass -= ((stars[i].mass / 100) * 10);
                        stars[i].lum -= ((stars[i].lum / 100) * 20);
                        break;
                    case 4:
                        stars[i].mass -= ((stars[i].mass / 100) * 20);
                        stars[i].lum -= ((stars[i].lum / 100) * 40);
                        break;
                    case 5:
                        stars[i].mass -= ((stars[i].mass / 100) * 30);
                        stars[i].lum -= ((stars[i].lum / 100) * 60);
                        break;
                    case 6:
                        stars[i].mass -= ((stars[i].mass / 100) * 40);
                        stars[i].lum -= ((stars[i].lum / 100) * 80);
                        break;
                    case 7:
                        stars[i].mass += ((stars[i].mass / 100) * 10);
                        stars[i].lum += ((stars[i].lum / 100) * 20);
                        break;
                    case 8:
                        stars[i].mass += ((stars[i].mass / 100) * 20);
                        stars[i].lum += ((stars[i].lum / 100) * 40);
                        break;
                    case 9:
                        stars[i].mass += ((stars[i].mass / 100) * 30);
                        stars[i].lum += ((stars[i].lum / 100) * 60);
                        break;
                    case 10:
                        stars[i].mass += ((stars[i].mass / 100) * 40);
                        stars[i].lum += ((stars[i].lum / 100) * 80);
                        break;
                    default:
                        break;
                }
                stars[i].rad = Math.pow(stars[i].lum, 0.5) * Math.pow((5800 / stars[i].temp), 2);
            } else if (stars[i].sizeClass === "III") {
                switch (mod) {
                    case 9:
                        stars[i].mass = stars[i].mass * 1.25;
                        stars[i].lum = stars[i].lum * 1.5;
                        break;
                    case 10:
                        stars[i].mass = stars[i].mass * 1.5;
                        stars[i].lum = stars[i].lum * 2;
                        break;
                    default:
                        stars[i].mass = stars[i].mass * ((mod / 10) + 0.2);
                        stars[i].lum = stars[i].lum * ((mod / 10) + 0.2);
                        break;
                }
            }
            if (i === 0 && (stars[i].sizeClass === "III" || stars[i].sizeClass === "IV")) {
                let adj: StarAge = this.findStarAge(stars[i], d10);
                let ageKeyExists = (9 in adj.age);
                let modKeyExists = (9 in adj.mod);
                let modifier = modKeyExists ? adj.mod[9] : 0;
                let modifier2 = (stars[i].sizeClass === "III") ? 20 : 10;

                age = ageKeyExists ? adj.life + adj.age[9] : adj.life;
                age += (age / 100) * modifier2;
                age = Math.ceil(age);
                stars[i].lum += (stars[i].lum / 100) * modifier;
            }
            if (age !== 0 && stars[i].starAge === 0) {
                stars[i].starAge = age;
            }
        }

        return stars;
    }

    recalculateDwarfs(stars: StarMap[]): StarMap[] {
        let age = 0;
        for (let i = 0; i < stars.length; i++) {
            let roll = this.rr(1, 10) - 1;
            let mod = 0;
            if (i === 0 && (stars[i].spectralClass === "WD" || stars[i].spectralClass === "BD")) {
                let adj = this.findStarAge(stars[i], roll);
                mod += adj.mod[roll];
                age = (roll in adj.age) ? adj.life + adj.age[roll] : adj.life;
            }
            if (age !== 0 && stars[i].starAge === 0) {
                stars[i].starAge = age;
            }
            let data;
            roll = this.rr(1, 10) - 1 + mod;
            roll = roll > 9 ? 9 : roll;
            roll = roll < 0 ? 0 : roll;
            if (stars[i].sizeClass === "VII" || stars[i].sizeClass === "") {
                data = (stars[i].sizeClass === "VII") ? whiteDwarf[roll] : brownDwarf[roll];
                stars[i].mass = data.mass;
                stars[i].rad = data.rad;
                stars[i].temp = data.temp;
                stars[i].lum = Math.pow(stars[i].rad, 2) * Math.pow(stars[i].temp, 4) / Math.pow(5800, 4);
            }
        }

        return stars;
    }

    convertStarMapsToStars(maps: StarMap[]): Star[] {
        let stars = [];
        for (let i = 0; i < maps.length; i++) {
            stars.push(new Star().import(maps[i]));
        }
        return stars;
    }

    findAbundance(mod: number): Abundance {
        let roll = this.rr(2, 20) + mod;
        return [...abundances].find((value) => {
            return value.min < roll && value.max >= roll;
        });
    }

    findStarAge(primary: StarMap, ranking: number): StarAge {
        return [...starAges].find((value) => {
            return value.spectralClass === primary.spectralClass && value.minRanking <= ranking && value.maxRanking >= ranking;
        });
    }

    findStarMap(d100: number): StarMap {
        return [...starMaps].find((value) => {
            return value.min <= d100 && value.max >= d100;
        });
    }

    setLumMassTempRad(star: StarMap): StarMap {
        let result = [...lumMassTempRads].find((value) => {
            return value.spectralClass === star.spectralClass && value.sizeClass === star.sizeClass;
        });

        if (result !== undefined) {
            star.lum = result.lum[star.spectralRanking];
            star.mass = result.mass[star.spectralRanking];
            star.temp = result.temp[star.spectralRanking];
            star.rad = result.rad[star.spectralRanking];
        }

        return star;
    }
}
