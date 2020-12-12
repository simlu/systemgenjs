export default class BaseOrbitsType<T> {
    orbitType: string = "";
    orbitSubType: string = "";
    orbitZone: string = "";
    orbitalPeriod: number = 0;
    orbits: BaseOrbitsType<any>[] = [];
    
    //orbital information
    separation: string = "";
    orbitalEccentricity: number = 0;
    meanSeparation: number = 0;
    closestSeparation: number = 0;
    furthestSeparation: number = 0;
    roche: number = 0;

    getType(): string {
        return "";
    }

    import(updated: object): this {
        let keys = Object.keys(this);
        let self = this;
        Object.entries(updated).forEach((entity) => {
            let key = entity[0];
            let value = entity[1];
            if (keys.includes(key)) {
                self[key] = value;
            }
        });

        return this;
    }
}
