import BaseBelt from "./base-belt";

export default class JunkRing extends BaseBelt<JunkRing> {
    description: string = "Junk Ring";

    getType(): string {
        return "JunkRing";
    }
}
