import BaseOrbitsType from "./base-orbits-type";

export default class BasePlanet<T> extends BaseOrbitsType<T> {

    solarDay: number = 0;
    lunarYear: number = 0;
    planetTilt: number = 0;
    tidalForce: number = 0;
    tidalLock: number = 0;
    mass: number = 0;
    radius: number = 0;
    density: number = 0;
    gravity: number = 0;
    escape: number = 0;

    getType(): string {
        return "Planet";
    }
}
