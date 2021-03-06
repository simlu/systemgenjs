import IGeneratorPart from "../../interfaces/generator-part";
import System from "../../components/system";
import {Abundance} from "../../tables/stella-data-tables";
import Planet from "../../components/planet";
import JunkRing from "../../components/junk-ring";
import {
    BaseOrbitParams,
    orbitZones,
    planetaryDensity,
    planetaryRadius,
    planetaryTypes,
    PlanetParams
} from "../../tables/planetary-data-tables";
import AsteroidBelt from "../../components/asteroid-belt";
import Trojan from "../../components/trojan";
import DoublePlanet from "../../components/double-planet";
import BaseOrbitsType from "../../components/base-orbits-type";
import Star from "../../components/star";
import Interloper from "../../components/interloper";
import CapturedBody from "../../components/captured-body";
import BasePlanet from "../../components/base-planet";

/**
 * @todo removing null orbits not working
 * @todo planet with no type
 */
export default class PlanetaryOrbits implements IGeneratorPart {
    rr: (min: number, max: number) => number;

    run(system: System): System {
        let primary = system.orbits[0];
        for (let i = 0; i < system.orbits.length; i++) {
            system.orbits[i] = this.workOnEachStar(primary, system.orbits[i], system.abundance);
        }

        return system;
    }

    workOnEachStar(primary: Star, star: Star, abundance: Abundance): Star {
        if (star.separation !== "Very Close" && star.separation !== "Very Close") {
            primary = star;
        }

        // loop though orbits and process stars.
        for (let i = 0; i < star.orbits.length; i++) {
            if (star.orbits[i].getType() === "Star") {
                star.orbits[i] = this.workOnEachStar(primary, <Star>star.orbits[i], abundance);
            }
        }

        star = this.addOrbits(primary, star, abundance);
        return star;
    }

    addOrbits(primary: Star, star: Star, abundance: Abundance): Star {
        let basicOrbits = this.calculateBasicOrbits(star, abundance);
        star = this.calculateZones(basicOrbits, star);
        let age = star.starAge;
        let newOrbits = [];
        for (let i = 0; i < star.orbits.length; i++) {
            let push = star.orbits[i];
            if (push.getType() !== "Star") {
                if (push.getType() === "Planet") {
                    push = this.calculateType(<Planet>push);
                    if (push !== null) {
                        push = this.calculatePlanetaryParams(primary, push, age, abundance);
                    }
                }
            }
            if (push !== null) {
                newOrbits[i] = push;
            }
        }

        star.orbits = newOrbits;

        return star;
    }

    calculatePlanetaryParams(primary: Star, orbitItem: BaseOrbitsType<any>, age: number, abundance: Abundance): BaseOrbitsType<any> {
        let type = orbitItem.getType();
        let zone = orbitItem.orbitZone;
        let params: PlanetParams;

        if (type === "AsteroidBelt") {
        } else if (type === "JunkRing") {
        } else {
            let planet: Planet = <Planet>orbitItem;
            let rolls = [
                this.rr(1, 10),
                this.rr(1, 10),
                this.rr(1, 10)
            ]
            params = this.calculateStandardParams(primary, planet, rolls, abundance.mod);
            params = this.finishParams(params, primary, planet)
            orbitItem.import(params);
            if (["DoublePlanet", "Trojan"].indexOf(orbitItem.getType()) > -1) {
                if (orbitItem.getType() === "DoublePlanet") {
                    let doubleType = planetaryTypes["Double Planet"][this.rr(1, 100)];
                    let double = (new Planet()).import(orbitItem);
                    double.orbitType = doubleType.orbitType;
                    double.orbitSubType = "";
                    if (["Chunk", "Terrestrial"].indexOf(double.orbitType) > -1) {
                        if (["Chunk", "Terrestrial"].indexOf(orbitItem.orbitType) === -1) {
                            rolls[0] = this.rr(1,3);
                        }
                    } else {
                        if (["Chunk", "Terrestrial"].indexOf(orbitItem.orbitType) !== -1) {
                            rolls[0] = this.rr(8,10);
                        }
                    }
                    rolls[1] += this.rr(-2, 2);
                    rolls[2] += this.rr(-2, 2);
                    params = this.calculateStandardParams(primary, double, rolls, abundance.mod);
                    params = this.finishParams(params, primary, double)
                    double.import(params);
                    orbitItem.orbits.push(double);
                } else {
                    let trojanType = planetaryTypes["Trojan Moon"][this.rr(1, 100)];
                    let trojanMoon = (new Planet()).import(orbitItem);
                    trojanMoon.orbitType = trojanType.orbitType;
                    trojanMoon.orbitSubType = "";
                    rolls = [
                        this.rr(1, 10),
                        this.rr(1, 10),
                        this.rr(1, 10)
                    ]
                    params = this.calculateStandardParams(primary, trojanMoon, rolls, abundance.mod);
                    params = this.finishParams(params, primary, trojanMoon)
                    trojanMoon.import(params);
                    orbitItem.orbits.push(trojanMoon);
                }
            }
        }

        return orbitItem
    }

    calculateStandardParams(primary: Star, planet: BasePlanet<any> , rolls: number[], mod:number) {
        let params;
        let type;
        if (["Chunk", "Terrestrial", "Gas Giant"].indexOf(planet.orbitType) > -1) {
            type = planet.orbitType;
            params = this.standardPlanetaryParams(type, primary, planet, rolls[0], rolls[1], rolls[2], mod);
        } else if (planet.orbitType === "Superjovian") {
            type = planet.orbitType;
            params = this.standardJovianParams(type, primary, planet, rolls[0], rolls[1], rolls[2], mod);
        }

        return params;
    }

    finishParams(params:PlanetParams, primary: Star, planet: BasePlanet<any>): PlanetParams {
        let d = this.rr(1, 10);
        let captured = (planet.orbitSubType === "Captured Body") ? true : false;
        params.tidalLock = (0.83 + (d * 0.03)) * params.tidalForce * (primary.starAge / 6.6);
        params.orbitalEccentricity = this.getObitalEccentricity(captured);
        params.closestSeparation = planet.meanSeparation * (1 - params.orbitalEccentricity);
        params.furthestSeparation = planet.meanSeparation * (1 + params.orbitalEccentricity);
        params.planetTilt = this.getAxialTilt();
        params.solarDay = this.calculateSolarDay(params, planet, primary.starAge);
        return params;
    }

    standardJovianParams(type: string, primary: Star, planet: BasePlanet<any>, roll: number, massRoll: number, radiusRoll:number, mod: number): PlanetParams {
        let zone = planet.orbitZone;
        let captured = (planet.orbitSubType === "Captured Body") ? true : false;
        let output = new PlanetParams();
        if (roll <= 4) {
            output.mass = 500 + massRoll* 50;
        } else if (roll <= 7) {
            output.mass = 1000 + massRoll * 100;
        } else if (roll <= 9) {
            output.mass = 2000 + massRoll * 100;
        } else {
            output.mass = 3000 + massRoll * 100;
        }
        output.radius = 60000 + (radiusRoll - (mod / 2)) * 2000;
        output.density = (259694072000 * output.mass) / Math.pow(output.radius, 3);
        output.gravity = output.mass / Math.pow((output.radius / 6380), 2);
        output.escape = Math.pow((19600 * output.gravity * output.radius), 0.5) / 11200;
        let yearMass = primary.mass;
        if ((primary.mass / output.mass) < 1.1) {
            yearMass = primary.mass + output.mass;
        }
        output.orbitalPeriod = Math.pow((Math.pow(planet.meanSeparation, 3) / yearMass), 0.5);
        output.tidalForce = (primary.mass * 26640000) / Math.pow((planet.meanSeparation * 400), 3);
        return output;
    }

    standardPlanetaryParams(type: string, primary: Star, planet: BasePlanet<any>, roll: number, densityRoll: number, radiusRoll:number, mod: number): PlanetParams {
        let zone = planet.orbitZone;
        let captured = (planet.orbitSubType === "Captured Body") ? true : false;
        let trojan = (planet.orbitSubType === "Trojan") ? true : false;
        let output = new PlanetParams();
        roll = (roll === 1) ? roll : roll + mod;
        roll = (zone === "Inner Zone") ? roll + 1 : roll;
        roll = (zone === "Life Zone") ? roll + 1 : roll;
        roll = trojan ? roll + 2 : roll;
        roll = (roll < 1) ? 1 : (roll > 10) ? 10 : roll;
        output.radius = planetaryRadius[type](roll, radiusRoll);
        output.density = planetaryDensity[zone][type](densityRoll);
        output.mass = Math.pow((output.radius / 6380), 3) * output.density;
        output.gravity = output.mass / Math.pow((output.radius / 6380), 2);
        output.escape = Math.pow((19600 * output.gravity * output.radius), 0.5) / 11200;
        let yearMass = primary.mass;
        if ((primary.mass / output.mass) < 1.1) {
            yearMass = primary.mass + output.mass;
        }
        output.orbitalPeriod = Math.pow((Math.pow(planet.meanSeparation, 3) / yearMass), 0.5);
        output.tidalForce = (primary.mass * 26640000) / Math.pow((planet.meanSeparation * 400), 3);
        return output;
    }

    calculateSolarDay(params: PlanetParams, planet: BasePlanet<any>, starAge: number): number {
        let output: number = -1;
        if (params.tidalLock < 1) {
            output = 0;
            let roll = this.rr(1, 10);
            roll += Math.floor((params.tidalForce * starAge));
            switch (true) {
                case (roll <= 5):
                    if (planet.orbitType === "Chunk") {
                        output = (this.rr(1, 10) * 2);
                    } else if (planet.orbitType !== "Gas Giant" && planet.orbitType !== "Superjovian") {
                        output = 10 + (this.rr(1, 10) * 2);
                    } else {
                        output = 6 + (this.rr(1, 10) / 2);
                    }
                    break;
                case (roll <= 7):
                    if (planet.orbitType === "Chunk") {
                        output = this.rr(1, 10) * 24;
                    } else if (planet.orbitType !== "Gas Giant" && planet.orbitType !== "Superjovian") {
                        output = 30 + this.rr(1, 100);
                    } else {
                        output = 11 + (this.rr(1, 10) / 2);
                    }
                    break;
                case (roll <= 9):
                    if (planet.orbitType === "Chunk") {
                        output = this.rr(1, 100) * 24;
                    } else if (planet.orbitType !== "Gas Giant" && planet.orbitType !== "Superjovian") {
                        output = this.rr(1, 100) * 2 * 24;
                    } else {
                        output = 16 + this.rr(1, 10);
                    }
                    break;
                case (roll >= 10):
                    if (planet.orbitType === "Gas Giant" || planet.orbitType === "Superjovian") {
                        output = (26 + this.rr(1, 10)) * 24;
                    } else {
                        output = -1;
                    }
                    break;
            }
            if (output !== -1) {
                if (params.tidalLock >= 1) {
                    output = -1;
                } else {
                    let mod = (planet.mass >= 4) ? -2 : 0;
                    mod += (planet.orbitType === "Gas Giant" && planet.mass <= 50) ? 2 : 0;
                    output = output * (1 + (mod * 0.1));
                }
            } else {
                if (params.tidalLock < 1) {
                    output = (100 + this.rr(1, 1000)) * 24;
                }
            }
        }

        return output;
    }

    getAxialTilt(): number {
        let roll = this.rr(1, 10);
        let output = 0;
        switch (true) {
            case (roll <= 2):
                output = this.rr(1, 10);
                break;
            case (roll <= 4):
                output = 10 + this.rr(1, 10);
                break;
            case (roll <= 6):
                output = 20 + this.rr(1, 10);
                break;
            case (roll <= 8):
                output = 30 + this.rr(1, 10);
                break;
            case (roll >= 9):
                output = 40 + (this.rr(1, 100) * 1.4);
                break;
        }

        return output;
    }

    getObitalEccentricity(captured: boolean): number {
        let roll = this.rr(1, 10);
        roll += (captured) ? 3 : 0;
        let output = 0;
        switch (true) {
            case (roll <= 5):
                output = 0.005 * this.rr(1, 10);
                break;
            case (roll <= 7):
                output = 0.05 + (0.01 * this.rr(1, 10));
                break;
            case (roll <= 9):
                output = 0.15 + (0.01 * this.rr(1, 10));
                break;
            case (roll >= 10):
                output = 0.25 + (0.04 * this.rr(1, 10));
                break;
        }

        return output;
    }

    calculateType(planet: Planet): BaseOrbitsType<any> | null {
        let roll = this.rr(1, 100);
        let target = planet.orbitZone === "Life Zone" ? "Inner Zone" : planet.orbitZone;
        if (planet.orbitType !== "") {
            target = planet.orbitType;
        }

        let planetaryType = planetaryTypes[target].find((val) => {
            return (val.min <= roll && val.max >= roll);
        });

        planet.orbitType = planetaryType.orbitType;
        if (planetaryType.reRoll) {
            while (planetaryType.reRoll) {
                target = planetaryType.orbitType;
                roll = this.rr(1, 100);
                planetaryType = planetaryTypes[target].find((val) => {
                    return (val.min <= roll && val.max >= roll);
                });
            }
            planet.orbitSubType = planetaryType.orbitType;
        }

        let pre = planet;
        let post:BaseOrbitsType<any>;
        if (pre.orbitType === "Asteroid Belt") {
            post = new AsteroidBelt().import(pre);
        } else if (pre.orbitType === "Ring") {
            post = new JunkRing();
        } else if (pre.orbitType === "Interloper") {
            post = new Interloper().import(pre);
            post.orbitType = pre.orbitSubType;
            post.orbitSubType = pre.orbitType;
        } else if (pre.orbitType === "Trojan") {
            post = new Trojan().import(pre);
            post.orbitType = pre.orbitSubType;
            post.orbitSubType = pre.orbitType;
        } else if (pre.orbitType === "Double Planet") {
            post = new DoublePlanet().import(pre);
            post.orbitType = pre.orbitSubType;
            post.orbitSubType = pre.orbitType;
        } else if (pre.orbitType === "Captured Body") {
            post = new CapturedBody().import(pre);
            post.orbitType = pre.orbitSubType;
            post.orbitSubType = pre.orbitType;
        } else if (pre.orbitType === "Empty Orbit") {
            post = null
        } else {
            post = pre;
        }

        return post;
    }

    calculateZones(planetOrbits: BaseOrbitParams[], star: Star): Star {
        let zones: { sep: number, zone: string }[];
        zones = [
            {sep: 0.75 * Math.pow(star.lum, 0.5), zone: orbitZones.STAR_INNER},
            {sep: Math.pow(star.lum, 0.5), zone: orbitZones.STAR_LIFE},
            {sep: 1.4 * Math.pow(star.lum, 0.5), zone: orbitZones.STAR_OUTER},
        ];
        for (let j = 0; j < planetOrbits.length; j++) {
            let po = new Planet();
            po.orbitType = planetOrbits[j].gotType;
            po.meanSeparation = planetOrbits[j].distance;
            if (star.spectralClass === "WD") {
                po.orbitZone = orbitZones.STAR_OUTER;
            } else {
                if (po.meanSeparation <= zones[0].sep) {
                    po.orbitZone = zones[0].zone;
                } else if (po.meanSeparation >= zones[2].sep) {
                    po.orbitZone = zones[2].zone;
                } else {
                    po.orbitZone = zones[1].zone;
                }
            }
            star.orbits.push(po);
        }

        return star;
    }

    calculateBasicOrbits(star: Star, abundance: Abundance): BaseOrbitParams[] {
        // work out modifier based on star type
        let mod = this.rr(1, 10);
        if (star.spectralClass === "K" && star.sizeClass === "V" && star.spectralRanking >= 5 && star.spectralRanking <= 9) {
            mod += 1;
        } else if (star.spectralClass === "M" && star.sizeClass === "V" && star.spectralRanking >= 0 && star.spectralRanking <= 4) {
            if (star.spectralRanking >= 0 && star.spectralRanking <= 4) {
                mod += 2;
            } else {
                mod += 3;
            }
        } else if (star.spectralClass === "BD") {
            mod += 5;
        }
        mod -= abundance.mod;

        // calculate number of planets.
        let planets = 0;
        switch (true) {
            case (mod <= 1):
                planets = this.rr(1, 10) + 10;
                break;
            case (mod >= 2 && mod <= 5):
                planets = this.rr(1, 10) + 5;
                break;
            case (mod >= 6 && mod <= 7):
                planets = this.rr(1, 10);
                break;
            case (mod >= 8 && mod <= 9):
                planets = this.rr(1, 5);
                break;
            default:
                planets = 0;
                break;
        }

        //generate distance, class and type basics
        let planetArray = [];
        let tot = 0.05 * Math.pow(star.mass, 2) * this.rr(1, 10);
        for (let j = 0; j < planets; j++) {
            tot *= 1.1 + (this.rr(1, 10) * 0.1);
            tot += 0.1;
            planetArray.push(new BaseOrbitParams(tot,""));
        }


        let limit = 0;
        // Remove orbits due to white dwarf
        if (star.spectralClass === "WD") {
            let roll = this.rr(1, 10);
            if (star.mass >= 0.6 && star.mass <= 0.9) {
                roll += 2;
            } else if (star.mass > 0.9) {
                roll += 4;
            }
            switch (true) {
                case (roll <= 4):
                    limit = 2;
                    break;
                case (mod >= 5 && mod <= 8):
                    limit = 4;
                    break;
                case (mod >= 9 && mod <= 11):
                    limit = 6;
                    break;
                default:
                    limit = 10;
                    break;
            }
        }

        // Remove orbits due to lum
        tot = 0.025 * Math.pow(star.lum, 0.5);
        limit = limit < tot ? tot : limit;
        tot = 0;
        star.orbits.forEach((val, i) => {
            if (val.getType() === "Star") {
                let childStar = <Star>val;
                if (childStar.separation === "Very Close" || childStar.separation === "Close") {
                    tot += childStar.furthestSeparation;
                }
            }
        });
        limit = limit < tot ? tot : limit;
        planetArray = planetArray.filter(planetData => planetData.distance > limit);

        // Remove orbits due to close or very close
        let ignoreZeroLength = false;
        star.orbits.forEach((val, i) => {
            if (val.getType() === "Star") {
                let childStar = <Star>val;
                if (childStar.separation === "Very Close" || childStar.separation === "Close") {
                    tot += 1000000;
                    ignoreZeroLength = true;
                }
            }
        });
        limit = limit < tot ? tot : limit;
        planetArray = planetArray.filter(planetData => planetData.distance > limit);

        // if all orbits are removed its likely they have rubbish left behind.
        if (planetArray.length === 0 && !ignoreZeroLength) {
            let mess = this.rr(1, 5);
            for (let k = 0; k < mess; k++) {
                let type = this.rr(1, 10);
                switch (true) {
                    case (type <= 3):
                        tot = this.rr(1, 10) * this.rr(1, 10);
                        planetArray.push(new BaseOrbitParams(tot,"Chunk"));
                        break;
                    case (type === 4):
                        tot = this.rr(1, 10);
                        planetArray.push(new BaseOrbitParams(tot,"Captured Body"));
                        break;
                    case (type <= 7):
                        tot = this.rr(1, 10);
                        planetArray.push(new BaseOrbitParams(tot,"Ring"));
                        break;
                }
            }
            planetArray = planetArray.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
        }

        return planetArray;
    }

    setRandomRange(callback: (min: number, max: number) => number): IGeneratorPart {
        this.rr = callback;
        return this;
    }

};
