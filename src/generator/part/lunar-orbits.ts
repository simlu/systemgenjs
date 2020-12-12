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
import PlanetPartial from "../planet-partial";

export default class LunarOrbits extends PlanetPartial implements IGeneratorPart {
    rr: (min: number, max: number) => number;

    run(system: System): System {
        let primary = system.orbits[0];
        for (let i = 0; i < system.orbits.length; i++) {
            system.orbits[i] = this.workOnEachStar(primary, system.orbits[i], system);
        }
        return system;
    }

    workOnEachPlanet(primary: Star, star: Star, planet: BasePlanet<any>, system: System): BasePlanet<any> {
        if (["Trojan", "DoublePlanet"].indexOf(planet.getType()) > -1) {

        } else if (planet.tidalLock <= 1) {
            let moons = this.calculateMoonCount(planet);
            for(let mi=0; mi<moons; mi++) {
                let moon = this.calculateMoonOrbits(new Planet().import({ orbitType: "Moon" }));
                let radiusRoll = this.rr(1, 100);
                if (moon.orbitType === "Inclined") {
                    radiusRoll = this.rr(1, 80);
                }
                moon = this.calculateMoonParams(moon, planet, system.abundance, radiusRoll, this.rr(1, 10));
                if (moon.meanSeparation < moon.roche && (moon.orbitType === "Chunk" || moon.orbitType === "Terrestrial"))
                {
                    let ring = new Ring();
                    ring.orbitZone = moon.orbitZone;
                    ring.separation = moon.separation;
                    ring.orbitalEccentricity = moon.orbitalEccentricity;
                    ring.meanSeparation = moon.meanSeparation;
                    ring.closestSeparation = moon.closestSeparation;
                    ring.furthestSeparation = moon.furthestSeparation;
                    ring.orbitalPeriod = moon.orbitalPeriod;
                    ring.roche = moon.roche;
                    ring.orbits.push(moon);
                    moon = ring;
                }
                planet.orbits.push(moon);
                /**
                 * SPECIAL ORBITS: The moon (not applicable to rings) has a odd orbit. Some such cases could be (roll 1D10):
                 1: Retrograde: The moon orbits the wrong way. This isn't too uncommon. Reroll to decide orbital distance, but ignore Close and Special distances. These moons often have distinct eccentricity and inclination too, and are often small. Roll twice for size and select the lower roll.
                 2-4: Shepherd: This is one (40%) or two (60%) moons of Tiny Chunk-size which is accompanying a ring. It is in Close orbit. Shepherds are common.
                 5-6: Trojan: The moon is in the same orbit, but in the LaGrange point of the previously generated moon in a non-Special orbit. (If it is larger than the previous moon, that moon is actually the Trojan). A maximum of three moons can share orbit, and the largest one must
                 PART I ORBITAL DATA 19
                 be at least on size class larger than the two Trojans. If no moon is generated before this one, reroll. Trojans are not in Very Distant orbits.
                 7: Shared Orbit: The moon is actually two moons, of Tiny Chunk size, which shares almost the same orbit. Unlike Trojans, these moons "catch up" with each other and exchange orbits regularly. Shared orbits are Close.
                 8-9: Eccentric. The moon has a very eccentric orbit. It is not in Close orbit. These satellites are generally small - roll twice and select the lower result.
                 */
            }
        }

        return planet;
    }

    calculateMoonParams(moon: BaseOrbitsType<any>, planet:BasePlanet<any>, abundance:Abundance, radiusRoll:number, densityRoll:number): BaseOrbitsType<any> {
        let zoneEquiv:number = (planet.orbitZone === "Outer Zone") ? 1 : 0;
        let params:PlanetParams = new PlanetParams();
        radiusRoll += (abundance.mod < 0) ? (abundance.mod * 2) : abundance.mod;
        switch(true) {
            case (radiusRoll <= 64):
                moon.orbitType = (moon.orbitType === "Moon") ? "Chunk" : moon.orbitType;
                params.radius = this.rr(1, 10) * 10;
                break;
            case (radiusRoll <= 84):
                moon.orbitType = (moon.orbitType === "Moon") ? "Chunk" : moon.orbitType;
                params.radius = this.rr(1, 10) * 100;
                break;
            case (radiusRoll <= 94):
                moon.orbitType = (moon.orbitType === "Moon") ? "Chunk" : moon.orbitType;
                params.radius = 1000 + (this.rr(1, 10) * 100);
                break;
            case (radiusRoll <= 99):
                moon.orbitType = (moon.orbitType === "Moon") ? "Terrestrial" : moon.orbitType;
                params.radius = 2000 + (this.rr(1, 10) * 200);
                break;
            default:
                moon.orbitType = (moon.orbitType === "Moon") ? "Terrestrial" : moon.orbitType;
                params.radius = 4000 + (this.rr(1, 10) * 400);
                break;
        }
        params.density = (zoneEquiv === 0) ? 0.3 + (densityRoll * 0.1) : 0.1 + (densityRoll * 0.05);
        params.mass =  Math.pow((params.radius / 6380),3) * params.density;
        params.gravity = params.mass / Math.pow((params.radius / 6380),2);
        params.lunarYear = Math.pow((moon.meanSeparation / 400000), 3) * Math.pow((793.64 / params.mass), 0.5);
        params.roche = 2.456 * Math.pow((planet.density / params.density), 0.33);

        moon.import(params);
        return moon;
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
                moon.orbitType = "Retrograde";
                moon.orbitZone = "Close";
                while (moon.orbitZone === "Close") {
                    moon = this.calculateMoonOrbits(moon, true);
                }
                break;
            case (roll<=4):
                moon = new Ring();
                moon.orbitType = "Ring";
                moon = this.calculateMoonOrbits(moon, true);
                break;
            case (roll<=6):
                moon = new Trojan();
                moon.orbitType = "Trojan";
                moon = this.calculateMoonOrbits(moon, true);
                break;
            case (roll === 7):
                moon.orbitType = "Shared";
                moon.orbitZone = "Close";
                moon.meanSeparation = this.rr(2, 6);
                break;
            case (roll <= 9):
                moon.orbitType = "Eccentric";
                moon.orbitZone = "Close";
                while (moon.orbitZone === "Close") {
                    moon = this.calculateMoonOrbits(moon, true);
                }
                break;
            default:
                moon.orbitType = "Inclined";
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
