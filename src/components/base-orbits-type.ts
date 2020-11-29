export default class BaseOrbitsType<T>{

    //orbital information
    public separation: string = "";
    public orbitZone: string = "";
    public orbitalEccentricity: number = 0;
    public meanSeparation: number = 0;
    public closestSeparation: number = 0;
    public furthestSeparation: number = 0;
    public orbitalPeriod: number = 0;
    public orbits:BaseOrbitsType<any>[] = [];

    getType(): string {
        return "";
    }

    map(object):this {
        for (let key in object) {
            if (this.hasOwnProperty(key)) {
                Reflect.set(this, key, object[key]);
            }
        }

        return this;
    }
}
