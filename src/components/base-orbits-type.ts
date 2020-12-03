export default class BaseOrbitsType<T> {

    //orbital information
    public separation: string = "";
    public orbitZone: string = "";
    public orbitalEccentricity: number = 0;
    public meanSeparation: number = 0;
    public closestSeparation: number = 0;
    public furthestSeparation: number = 0;
    public orbitalPeriod: number = 0;
    public orbits: BaseOrbitsType<any>[] = [];

    getType(): string {
        return "";
    }

    update(updated: Partial<T>): this {
        Object.assign(this, updated);

        return this;
    }
}
