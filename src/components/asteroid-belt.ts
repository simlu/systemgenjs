import BaseOrbitsPlanet from "./base-orbits-planet";
import BaseBelt from "./base-belt";

export default class AsteroidBelt extends BaseBelt<AsteroidBelt> {
    description:string = "Asteroid Belt";

    getType(): string {
        return "Belt";
    }

}
