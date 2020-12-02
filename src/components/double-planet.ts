import BasePlanet from "./base-planet";

export default class DoublePlanet extends BasePlanet<DoublePlanet> {
    description:string = "Double Planet";

    getType(): string {
        return "DoublePlanet";
    }
}
