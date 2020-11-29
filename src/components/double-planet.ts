import BaseOrbitsStar from "./base-orbits-star";

export default class DoublePlanet extends BaseOrbitsStar<DoublePlanet> {
    description:string = "Double Planet";
    planetType: string = "";
    planetSubType: string = "";

    tidalForce: number = 0;
    tidalLock: number = 0;
    mass:number = 0;
    radius:number = 0;
    density:number = 0;
    gravity:number = 0;
    escape:number = 0;

    getType(): string {
        return "DoublePlanet";
    }
}
