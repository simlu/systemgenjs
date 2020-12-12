import IGeneratorPart from "../../interfaces/generator-part";
import System from "../../components/system";
import Star from "../../components/star";
import BasePlanet from "../../components/base-planet";
import PlanetPartial from "../planet-partial";
import {tectonicActivities, TectonicActivity} from "../../tables/planetary-data-tables";

export default class GeophysicalData extends PlanetPartial implements IGeneratorPart {
    rr: (min: number, max: number) => number;

    run(system: System): System {
        let primary = system.orbits[0];
        for (let i = 0; i < system.orbits.length; i++) {
            system.orbits[i] = this.workOnEachStar(primary, system.orbits[i], system);
        }
        return system;
    }

    workOnEachPlanet(primary: Star, star: Star, planet: BasePlanet<any>, system: System, isMoon:boolean = false): BasePlanet<any> {
        let zone = planet.orbitZone;
        let type = planet.getType();
        if (type != "Ring") {
            planet = this.planetComposition(system.age, zone, planet, isMoon);
        }
        for (let i = 0; i < planet.orbits.length; i++) {
            planet.orbits[i] = this.workOnEachPlanet(primary, star, <BasePlanet<any>>planet.orbits[i], system, true);
        }
        return planet;
    }

    planetComposition(age:number, zone:string, planet: BasePlanet<any>, isMoon:boolean = false): BasePlanet<any> {
        if (planet.orbitType === "Chunk" || planet.orbitType === "Terrestrial") {
            let mostlyIce = false;
            if (zone === "Inner Zone" || zone === "Life Zone") {
                planet.crustComposition = "Silicates";
                switch(true) {
                    case (planet.density <= 0.7):
                        planet.coreSize = "Small";
                        planet.coreComposition = "Metal";
                        planet.mantleComposition = "Silicates";
                        break;
                    case (planet.density <= 1.0):
                        planet.coreSize = "Medium";
                        planet.coreComposition = "Metal";
                        planet.mantleComposition = "Iron-nickel";
                        break;
                    case (planet.density > 1.0):
                        planet.coreSize = "Large";
                        planet.coreComposition = "Metal";
                        planet.mantleComposition = "Iron-nickel";
                        break;
                }
            } else {
                planet.crustComposition = "Ice";
                switch(true) {
                    case (planet.density <= 0.30):
                        planet.coreSize = "N/A";
                        planet.coreComposition = "Ice";
                        planet.mantleComposition = "Ice";
                        mostlyIce = true;
                        break;
                    case (planet.density <= 0.45):
                        planet.coreSize = "Small";
                        planet.coreComposition = "Silicates";
                        planet.mantleComposition = "Ice";
                        mostlyIce = true;
                        break;
                    case (planet.density > 0.45):
                        planet.coreSize = "Small";
                        planet.coreComposition = "Metal";
                        planet.mantleComposition = "Silicates";
                        planet.crustComposition = "Silicates";
                        break;
                }
            }
            planet.teutonicActivity = this.calculateTectonicFactor(planet.density, planet.orbitalPeriod, age, planet.mass, planet.tidalForce, mostlyIce, isMoon);

        }
        return planet;
    }

    calculateTectonicFactor(density:number, orbitalPeriod:number, age:number, mass:number, tidalForce:number, mostlyIce:boolean, isMoon:boolean):string {

        let tFactor = this.rr(6, 15) * (Math.pow(mass,0.5) / age);
        if (isMoon && tidalForce > 1) {
            tFactor = tFactor * (1.0 + (0.25 * tidalForce));
        }

        if (mostlyIce) {
            tFactor = tFactor * density;
        }

        if (!isMoon) {
            if (tidalForce > 1 || orbitalPeriod >= (24 * 365) ) {
                tFactor = tFactor * 0.5;
            } else if (orbitalPeriod >= 100 ) {
                tFactor = tFactor * 0.75;
            } else if (orbitalPeriod <= 18 ) {
                tFactor = tFactor * 1.25;
            }
        }

        let roll:number = this.rr(1, 10);
        let activity:TectonicActivity = this.getTectonicActivity(tFactor);

        return activity.activities[roll];
    }

    getTectonicActivity(taf: number): TectonicActivity {
        return [...tectonicActivities].find((value) => {
            return value.min <= taf && value.max > taf;
        });
    }

    setRandomRange(callback: (min: number, max: number) => number): IGeneratorPart {
        this.rr = callback;
        return this;
    }
}
