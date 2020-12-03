import IGeneratorPart from "../../interfaces/generator-part";
import System from "../../components/system";
import Star from "../../components/star";
import BasePlanet from "../../components/base-planet";
import Planet from "../../components/planet";
import Ring from "../../components/ring";
import BaseOrbitsType from "../../components/base-orbits-type";
import Trojan from "../../components/trojan";
import {Abundance} from "../../tables/stella-data-tables";
import {PlanetParams} from "../../tables/planetary-data-tables";

export default class LunarOrbits implements IGeneratorPart {
    rr: (min: number, max: number) => number;

    run(system: System): System {
        let primary = system.orbits[0];
        for (let i = 0; i < system.orbits.length; i++) {
            system.orbits[i] = this.workOnEachStar(primary, system.orbits[i], system);
        }
        return system;
    }

    workOnEachStar(primary: Star, star: Star, system: System): Star {
        if (star.separation !== "Very Close" && star.separation !== "Very Close") {
            primary = star;
        }

        // loop though orbits and process stars.
        for (let i = 0; i < star.orbits.length; i++) {
            if (star.orbits[i].getType() === "Star") {
                star.orbits[i] = this.workOnEachStar(primary, <Star>star.orbits[i], system);
            }
        }

        star = this.workOnEachStarsOrbits(primary, star, system);
        return star;
    }

    workOnEachStarsOrbits(primary: Star, star: Star, system: System): Star {
        for (let i = 0; i < star.orbits.length; i++) {
            if (star.orbits[i].getType() !== "Star") {
                star.orbits[i] = this.workOnEachPlanet(primary, star, <BasePlanet<any>>star.orbits[i], system);
            }
        }
        return star;
    }

    workOnEachPlanet(primary: Star, star: Star, planet: BasePlanet<any>, system: System): BasePlanet<any> {
        if (["Trojan", "DoublePlanet"].indexOf(planet.getType()) > -1) {

        } else if (planet.tidalLock <= 1) {
            let moons = this.calculateMoonCount(planet);
            for(let mi=0; mi<moons; mi++) {
                let moon = this.calculateMoonOrbits(new Planet().import({ orbitType: "Moon" }));
                let params = this.calculateMoonParams(system.abundance, 0, moon.meanSeparation);
                /**
                 * SPECIAL ORBITS: The moon (not applicable to rings) has a odd orbit. Some such cases could be (roll 1D10):
                 1: Retrograde: The moon orbits the wrong way. This isn't too uncommon. Reroll to decide orbital distance, but ignore Close and Special distances. These moons often have distinct eccentricity and inclination too, and are often small. Roll twice for size and select the lower roll.
                 2-4: Shepherd: This is one (40%) or two (60%) moons of Tiny Chunk-size which is accompanying a ring. It is in Close orbit. Shepherds are common.
                 5-6: Trojan: The moon is in the same orbit, but in the LaGrange point of the previously generated moon in a non-Special orbit. (If it is larger than the previous moon, that moon is actually the Trojan). A maximum of three moons can share orbit, and the largest one must
                 PART I ORBITAL DATA 19
                 be at least on size class larger than the two Trojans. If no moon is generated before this one, reroll. Trojans are not in Very Distant orbits.
                 7: Shared Orbit: The moon is actually two moons, of Tiny Chunk size, which shares almost the same orbit. Unlike Trojans, these moons "catch up" with each other and exchange orbits regularly. Shared orbits are Close.
                 8-9: Eccentric. The moon has a very eccentric orbit. It is not in Close orbit. These satellites are generally small - roll twice and select the lower result.
                 10: Inclined. The moon has a very inclined orbit compared to the planet's rotational plane. Extreme inclination includes polar orbits. As with Eccentric moons, the satellites are usually small.
                 */
            }
        }

        return planet;
    }

    calculateMoonParams(abundance:Abundance, zoneEquiv:number, separation:number): PlanetParams {

        let params:PlanetParams = new PlanetParams();
        params.radius = this.calculateRadius(abundance);
        params.density = (zoneEquiv === 0) ? 0.3 + (this.rr(1, 10) * 0.1) : 0.1 + (this.rr(1, 10) * 0.05);
        params.mass =  Math.pow((params.radius / 6380),3) * params.density;
        params.gravity = params.mass / Math.pow((params.radius / 6380),2);
        params.lunarYear = Math.pow((separation / 400000), 3) * Math.pow((793.64 / params.mass), 0.5);


        return params;
    }
    
    calculateRadius(abundance:Abundance): number {
        let roll = this.rr(1, 100);
        roll += (abundance.mod < 0) ? (abundance.mod * 2) : abundance.mod;

        let radius;
        switch(true) {
            case (roll<=64):
                radius = this.rr(1, 10) * 10;
                break;
            case (roll<=84):
                radius = this.rr(1, 10) * 100;
                break;
            case (roll<=94):
                radius = 1000 + (this.rr(1, 10) * 100);
                break;
            case (roll <= 99):
                radius = 2000 + (this.rr(1, 10) * 200);
                break;
            default:
                radius = 4000 + (this.rr(1, 10) * 400);
                break;
        }

        return radius;
    }

    calculateMoonOrbits(moon: BaseOrbitsType<any>, reRollSpecial:boolean = false): BaseOrbitsType<any>  {
        let roll = this.rr(1, 10);
        switch(true) {
            case (roll<=4):
                moon.orbitZone = "Close";
                moon.meanSeparation = this.rr(2, 6);
                break;
            case (roll<6):
                moon.orbitZone = "Average";
                moon.meanSeparation = this.rr(7, 16);
                break;
            case (roll<8):
                moon.orbitZone = "Distant";
                moon.meanSeparation = this.rr(19, 46);
                break;
            case (roll === 9):
                moon.orbitZone = "Very Distant";
                moon.meanSeparation = this.rr(48, 345);
                break;
            default:
                if (reRollSpecial) {
                    moon = this.calculateMoonOrbits(moon, reRollSpecial);
                } else {
                    moon = this.calculateSpecialOrbits(moon);
                }
                break;
        }

        return moon;
    }

    calculateSpecialOrbits(moon: BaseOrbitsType<any>): BaseOrbitsType<any> {
        let roll = this.rr(1, 10);
        switch(true) {
            case (roll===1):
                moon.orbitType = "Retrograde"
                moon.orbitZone = "Close";
                while (moon.orbitZone === "Close") {
                    moon = this.calculateMoonOrbits(moon, true);
                }
                break;
            case (roll<=4):
                moon = new Ring();
                moon = this.calculateMoonOrbits(moon, true);
                break;
            case (roll<=6):
                moon = new Trojan();
                moon = this.calculateMoonOrbits(moon, true);
                break;
            case (roll === 7):
                moon.orbitType = "Shared"
                moon.orbitZone = "Close";
                moon.meanSeparation = this.rr(2, 6);
                break;
            case (roll <= 9):
                moon.orbitType = "Shared"
                moon.orbitZone = "Close";
                while (moon.orbitZone === "Close") {
                    moon = this.calculateMoonOrbits(moon, true);
                }
                break;
            default:
                moon.orbitType = "Inclined"
                moon = this.calculateMoonOrbits(moon, true);
                break;
        }

        return moon;
    }

    calculateMoonCount(planet: BaseOrbitsType<any>): number {
        let roll = this.rr(1, 10);
        roll += (planet.orbitZone === "Outer Zone") ? 5 : 0;
        let moons = 0;
        if (planet.orbitType === "Chunk") {
            moons += (roll >= 10) ? 1 : 0;
        } else if (planet.orbitType === "Gas Giant" || planet.orbitType === "Superjovian") {
            moons += (roll >= 1 && roll <= 5) ? this.rr(1, 5) : 0;
            moons += (roll >= 1 && roll <= 5) ? this.rr(1, 10) : 0;
            moons += (roll >= 1 && roll <= 5) ? 5 + this.rr(1, 10) : 0;
            moons += (roll >= 1 && roll <= 5) ? 10 + this.rr(1, 10) : 0;
            moons += (roll >= 1 && roll <= 5) ? 20 + this.rr(1, 10) : 0;
        } else {
            moons += (roll >= 6 && roll <= 7) ? 1 : 0;
            moons += (roll >= 8 && roll <= 9) ? this.rr(1, 2) : 0;
            moons += (roll >= 10 && roll <= 13) ? this.rr(1, 5) : 0;
            moons += (roll >= 14) ? this.rr(1, 10) : 0;
        }

        return moons;
    }

    setRandomRange(callback: (min: number, max: number) => number): IGeneratorPart {
        this.rr = callback;
        return this;
    }

}
