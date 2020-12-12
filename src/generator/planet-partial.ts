import Star from "../components/star";
import System from "../components/system";
import BasePlanet from "../components/base-planet";

export default class PlanetPartial {

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
        return planet;
    }
}
