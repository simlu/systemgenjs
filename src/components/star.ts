export default class Star {
    public starAge: number = 0;
    public spectralClass: string = "";
    public spectralRanking: number = 0;
    public starDesc: string = "";
    public sizeClass:string = "";
    public lum:number = 0;
    public mass:number = 0;
    public temp:number = 0;
    public rad:number = 0;
    map(object):Star {
        for (let key in object) {
            if (this.hasOwnProperty(key)) {
                Reflect.set(this, key, object[key]);
            }
        }

        return this;
    }
}
