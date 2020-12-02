import BasePlanet from "./base-planet";

export default class CapturedBody extends BasePlanet<CapturedBody>{
    description:string = "Captured Body";

    getType(): string {
        return "CapturedBody";
    }
}
