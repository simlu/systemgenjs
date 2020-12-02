import BasePlanet from "./base-planet";

export default class Trojan extends BasePlanet<Trojan> {
    description:string = "Trojan";

    getType(): string {
        return "Trojan";
    }
}
