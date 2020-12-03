import BaseOrbitsType from "./base-orbits-type";

export default class Star extends BaseOrbitsType<Star> {
    starAge: number = 0;
    spectralClass: string = "";
    spectralRanking: number = 0;
    starDesc: string = "";
    sizeClass: string = "";
    lum: number = 0;
    mass: number = 0;
    temp: number = 0;
    rad: number = 0;

    getType(): string {
        return "Star";
    }
}
