import BaseOrbitsType from "./base-orbits-type";

export default class BasePlanet<T> extends BaseOrbitsType<T> {

    rotationalPeriod: number = 0;
    solarDay: number = 0;
    solarYear: number = 0;
    planetTilt: number = 0;
    tidalForce: number = 0;
    tidalLock: number = 0;
    mass: number = 0;
    radius: number = 0;
    density: number = 0;
    gravity: number = 0;
    escape: number = 0;
    coreSize: string = "";
    coreComposition: string = "";
    mantleComposition: string = "";
    crustComposition: string = "";
    teutonicActivity: string = "";

    getType(): string {
        return "Planet";
    }
}
