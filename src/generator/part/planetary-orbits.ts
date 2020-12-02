import IGeneratorPart from "../../interfaces/generator-part";
import System from "../../components/system";
import {Abundance} from "../../tables/stella-data-tables";
import Planet from "../../components/planet";
import JunkRing from "../../components/junk-ring";
import {orbitZones, planetaryDensity, planetaryRadius, planetaryTypes, PlanetParams} from "../../tables/planetary-data-tables";
import AsteroidBelt from "../../components/asteroid-belt";
import Trojan from "../../components/trojan";
import DoublePlanet from "../../components/double-planet";
import BaseOrbitsType from "../../components/base-orbits-type";
import Star from "../../components/star";
import BaseOrbitsStar from "../../components/base-orbits-star";
import Interloper from "../../components/interloper";
import CapturedBody from "../../components/captured-body";
import BasePlanet from "../../components/base-planet";

/**
 * @todo removing null orbits not working
 * @todo planet with no type
 */
export default class PlanetaryOrbits implements IGeneratorPart {
    roller: (rollFormat: string) => number;

    run(system: System): System {
        let primary = system.orbits[0];
        for (let i = 0; i < system.orbits.length; i++) {
            system.orbits[i] = this.handleOrbits(primary, system.orbits[i], system.abundance);
        }

        return system;
    }

    handleOrbits(primary: Star, star: Star, abundance: Abundance): Star {
        if (star.separation !== "Very Close" && star.separation !== "Very Close") {
            primary = star;
        }

        // loop though orbits and process stars.
        for (let i = 0; i < star.orbits.length; i++) {
            if (star.orbits[i].getType() === "Star") {
                star.orbits[i] = this.handleOrbits(primary, <Star>star.orbits[i], abundance);
            }
        }

        this.addOrbits(primary, star, abundance);
        return star;
    }

    addOrbits(primary: Star, star: Star, abundance: Abundance): Star {
        let basicOrbits = this.generateBasicOrbits(star, abundance);
        star = this.generateZones(basicOrbits, star);
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

    calculatePlanetaryParams(primary: Star, orbitItem: BaseOrbitsStar<any>, age: number, abundance: Abundance): BaseOrbitsStar<any> {
        let type = orbitItem.getType();
        let zone = orbitItem.orbitZone;
        let params: PlanetParams;

        if (type === "Belt") {
        } else if (type === "JunkRing") {
        } else {
            let planet: Planet = <Planet>orbitItem;
            let captured = (planet.planetSubType === "Captured Body") ? true: false;
            if (["Chunk", "Terrestrial", "Gas Giant"].indexOf(planet.planetType) > -1) {
                type = planet.planetType;
                params = this.standardPlanetaryParams(type, primary, planet, this.roller("d10"), abundance.mod);
            } else if (planet.planetType === "Superjovian") {
                type = planet.planetType;
                params = this.standardJovianParams(type, primary, planet, this.roller("d10"), abundance.mod);
            }
            orbitItem.map(params);
        }

        return orbitItem
    }

    standardJovianParams(type:string, primary: Star, planet:BasePlanet<any>, roll:number, mod:number): PlanetParams {
        let zone = planet.orbitZone;
        let captured = (planet.planetSubType === "Captured Body") ? true: false;
        let output = new PlanetParams();
        if (roll <= 4) {
            output.mass = 500 + this.roller("d10") * 50;
        } else if (roll <= 7) {
            output.mass = 1000 + this.roller("d10") * 100;
        } else if (roll <= 9) {
            output.mass = 2000 + this.roller("d10") * 100;
        } else {
            output.mass = 3000 + this.roller("d10") * 100;
        }
        output.radius = 60000 + (this.roller("d10") - (mod / 2)) * 2000;
        output.density = (259694072000 * output.mass) / Math.pow(output.radius, 3);
        output.gravity = output.mass / Math.pow((output.radius / 6380), 2);
        output.escape = Math.pow((19600 * output.gravity * output.radius), 0.5) / 11200;
        let yearMass = primary.mass;
        if ((primary.mass/output.mass)<1.1) {
            yearMass = primary.mass + output.mass;
        }
        output.orbitalPeriod = Math.pow((Math.pow(planet.meanSeparation,3) / yearMass), 0.5);
        output.tidalForce = (primary.mass * 26640000) / Math.pow((planet.meanSeparation * 400),3);
        let d = this.roller("d10");
        output.tidalLock = (0.83 + (d * 0.03)) * output.tidalForce * (primary.starAge/6.6);
        output.orbitalEccentricity = this.getObitalEccentricity(captured);
        output.closestSeparation = planet.meanSeparation * ( 1 - output.orbitalEccentricity );
        output.furthestSeparation = planet.meanSeparation * ( 1 + output.orbitalEccentricity );
        output.planetTilt = this.getAxialTilt();
        output.solarDay = this.calculateSolarDay(output, planet, primary.starAge);
        return output;
    }

    standardPlanetaryParams(type:string, primary: Star, planet:BasePlanet<any>, roll:number, mod:number): PlanetParams {
        let zone = planet.orbitZone;
        let captured = (planet.planetSubType === "Captured Body") ? true: false;
        let output = new PlanetParams();
        roll = (roll === 1) ? roll : roll + mod;
        roll = (zone === "Inner Zone") ? roll + 1 : roll;
        roll = (zone === "Life Zone") ? roll + 1 : roll;
        roll = (roll < 1) ? 1 : (roll > 10) ? 10 : roll;
        output.radius = planetaryRadius[type](roll, this.roller("d10"));
        output.density = planetaryDensity[zone][type](this.roller("d10"));
        output.mass = Math.pow((output.radius / 6380), 3) * output.density;
        output.gravity = output.mass / Math.pow((output.radius / 6380), 2);
        output.escape = Math.pow((19600 * output.gravity * output.radius), 0.5) / 11200;
        let yearMass = primary.mass;
        if ((primary.mass/output.mass)<1.1) {
            yearMass = primary.mass + output.mass;
        }
        output.orbitalPeriod = Math.pow((Math.pow(planet.meanSeparation,3) / yearMass), 0.5);
        output.tidalForce = (primary.mass * 26640000) / Math.pow((planet.meanSeparation * 400),3);
        let d = this.roller("d10");
        output.tidalLock = (0.83 + (d * 0.03)) * output.tidalForce * (primary.starAge/6.6);
        output.orbitalEccentricity = this.getObitalEccentricity(captured);
        output.closestSeparation = planet.meanSeparation * ( 1 - output.orbitalEccentricity );
        output.furthestSeparation = planet.meanSeparation * ( 1 + output.orbitalEccentricity );
        output.planetTilt = this.getAxialTilt();
        output.solarDay = this.calculateSolarDay(output, planet, primary.starAge);
        return output;
    }

    calculateSolarDay(params:PlanetParams, planet:BasePlanet<any>, starAge:number):number {
        let output: number = -1;
        if ( params.tidalLock < 1) {
            output = 0;
            let roll = this.roller("d10");
            roll += Math.floor((params.tidalForce * starAge));
            switch (true) {
                case (roll <= 5):
                    if (planet.planetType === "Chunk") {
                        output = (this.roller("d10") * 2);
                    } else if (planet.planetType !== "Gas Giant" && planet.planetType !== "Superjovian") {
                        output = 10 + (this.roller("d10") * 2);
                    } else {
                        output = 6 + (this.roller("d10") / 2);
                    }
                    break;
                case (roll <= 7):
                    if (planet.planetType === "Chunk") {
                        output = this.roller("d10") * 24;
                    } else if (planet.planetType !== "Gas Giant" && planet.planetType !== "Superjovian") {
                        output = 30 + this.roller("d100");
                    } else {
                        output = 11 + (this.roller("d10") / 2);
                    }
                    break;
                case (roll <= 9):
                    if (planet.planetType === "Chunk") {
                        output = this.roller("d100") * 24;
                    } else if (planet.planetType !== "Gas Giant" && planet.planetType !== "Superjovian") {
                        output = this.roller("d100") * 2 * 24;
                    } else {
                        output = 16 + this.roller("d10");
                    }
                    break;
                case (roll >= 10):
                    if (planet.planetType === "Gas Giant" || planet.planetType === "Superjovian") {
                        output = (26 + this.roller("d10")) * 24;
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
                    mod += (planet.planetType === "Gas Giant" && planet.mass <= 50) ? 2 : 0;
                    output = output * (1 + (mod * 0.1));
                }
            } else {
                if (params.tidalLock < 1) {
                    output = (100 + this.roller("D1000")) * 24;
                }
            }
        }

        return output;
    }

    getAxialTilt(): number {
        let roll = this.roller("d10");
        let output = 0;
        switch(true) {
            case (roll <= 2):
                output = this.roller("d10");
                break;
            case (roll <= 4):
                output = 10 + this.roller("d10");
                break;
            case (roll <= 6):
                output = 20 + this.roller("d10");
                break;
            case (roll <= 8):
                output = 30 + this.roller("d10");
                break;
            case (roll >= 9):
                output = 40 + (this.roller("d100") * 1.4);
                break;
        }

        return output;
    }

    getObitalEccentricity(captured:boolean): number {
        let roll = this.roller("d10");
        roll += (captured) ? 3 : 0;
        let output = 0;
        switch(true) {
            case (roll <= 5):
                output = 0.005 * this.roller("d10");
                break;
            case (roll <= 7):
                output = 0.05 + (0.01 * this.roller("d10"));
                break;
            case (roll <= 9):
                output = 0.15 + (0.01 * this.roller("d10"));
                break;
            case (roll >= 10):
                output = 0.25 + (0.04 * this.roller("d10"));
                break;
        }

        return output;
    }

    calculateType(planet: Planet): BaseOrbitsType<any>|null {
        let roll = this.roller("d100");
        let target = planet.orbitZone;
        if (planet.planetType !== "") {
            target = planet.planetType;
        }

        let planetaryType = planetaryTypes[target].find((val) => {
            return (val.min <= roll && val.max >= roll);
        });

        planet.planetType = planetaryType.planetType;
        if (planetaryType.reRoll) {
            while (planetaryType.reRoll) {
                target = planetaryType.planetType;
                roll = this.roller("d100");
                planetaryType = planetaryTypes[target].find((val) => {
                    return (val.min <= roll && val.max >= roll);
                });
            }
            planet.planetSubType = planetaryType.planetType;
        }

        let pre = planet;
        let post;
        if (pre.planetType === "Asteroid Belt") {
            post = new AsteroidBelt().map(pre);
            post.meanSeparation = pre.meanSeparation;
            post.orbitZone = pre.orbitZone;
        } else if (pre.planetType === "Ring") {
            post = new JunkRing().map(pre);
            post.meanSeparation = pre.meanSeparation;
            post.orbitZone = pre.orbitZone;
        } else if (pre.planetType === "Interloper") {
            post = new Interloper().map(pre);
            post.planetType = pre.planetSubType;
            post.planetSubType = pre.planetType;
            post.meanSeparation = pre.meanSeparation;
            post.orbitZone = pre.orbitZone;
        } else if (pre.planetType === "Trojan") {
            post = new Trojan();
            post.planetType = pre.planetSubType;
            post.planetSubType = pre.planetType;
            post.meanSeparation = pre.meanSeparation;
            post.orbitZone = pre.orbitZone;
        } else if (pre.planetType === "Double Planet") {
            post = new DoublePlanet();
            post.planetType = pre.planetSubType;
            post.planetSubType = pre.planetType;
            post.meanSeparation = pre.meanSeparation;
            post.orbitZone = pre.orbitZone;
        } else if (pre.planetType === "Captured Body") {
            post = new CapturedBody();
            post.planetType = pre.planetSubType;
            post.planetSubType = pre.planetType;
            post.meanSeparation = pre.meanSeparation;
            post.orbitZone = pre.orbitZone;
        } else if (pre.planetType === "Empty Orbit") {
            post = null
        } else {
            post = pre;
        }

        return post;
    }

    generateZones(planetOrbits: { distance: number, type: string }[], star: Star): Star {
        let zones: { sep: number, zone: string }[];
        zones = [
            {sep: 0.75 * Math.pow(star.lum, 0.5), zone: orbitZones.STAR_INNER},
            {sep: Math.pow(star.lum, 0.5), zone: orbitZones.STAR_LIFE},
            {sep: 1.4 * Math.pow(star.lum, 0.5), zone: orbitZones.STAR_OUTER},
        ];
        for (let j = 0; j < planetOrbits.length; j++) {
            let po = new Planet();
            po.planetType = planetOrbits[j].type;
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

    generateBasicOrbits(star: Star, abundance: Abundance): { distance: number, type: string }[] {
        // work out modifier based on star type
        let mod = this.roller("d10");
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
                planets = this.roller("d10") + 10;
                break;
            case (mod >= 2 && mod <= 5):
                planets = this.roller("d10") + 5;
                break;
            case (mod >= 6 && mod <= 7):
                planets = this.roller("d10");
                break;
            case (mod >= 8 && mod <= 9):
                planets = this.roller("d5");
                break;
            default:
                planets = 0;
                break;
        }

        //generate distance, class and type basics
        let planetArray = [];
        let tot = 0.05 * Math.pow(star.mass, 2) * this.roller("d10");
        for (let j = 0; j < planets; j++) {
            tot *= 1.1 + (this.roller("d10") * 0.1);
            tot += 0.1;
            planetArray.push({distance: tot, type: ""});
        }


        let limit = 0;
        // Remove orbits due to white dwarf
        if (star.spectralClass === "WD") {
            let roll = this.roller('d10');
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
            let mess = this.roller("d5");
            for (let k = 0; k < mess; k++) {
                let type = this.roller("d10");
                switch (true) {
                    case (type <= 3):
                        tot = this.roller("d10") * this.roller("d10");
                        planetArray.push({distance: tot, type: "Chunk"});
                        break;
                    case (type === 4):
                        tot = this.roller("d10");
                        planetArray.push({distance: tot, type: "Captured Body"});
                        break;
                    case (type <= 7):
                        tot = this.roller("d10");
                        planetArray.push({distance: tot, type: "Ring"});
                        break;
                }
            }
            planetArray = planetArray.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
        }

        return planetArray;
    }

    setRoller(callback: (rollFormat: string) => number): IGeneratorPart {
        this.roller = callback;
        return this;
    }

};
