import BasePlanet from "./base-planet";

export default class Interloper extends BasePlanet<Interloper> {
    description: string = "Interloper";

    getType(): string {
        return "Interloper";
    }
}
