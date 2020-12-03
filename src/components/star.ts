import BaseOrbitsType from "./base-orbits-type";

export default class Star extends BaseOrbitsType<Star> {
    description: string = "Star";
    public starAge: number = 0;
    public spectralClass: string = "";
    public spectralRanking: number = 0;
    public starDesc: string = "";
    public sizeClass: string = "";
    public lum: number = 0;
    public mass: number = 0;
    public temp: number = 0;
    public rad: number = 0;

    getType(): string {
        return "Star";
    }
}
