export default class StarOrbit {
    constructor(id:number, parent:number | null = null) {
        this.starId = id;
        this.parentId = parent;
    }
    starId: number = -1;
    parentId: number | null = null;
    sep: number = -1;
}
