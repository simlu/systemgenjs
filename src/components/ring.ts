import BaseBelt from "./base-belt";

export default class Ring extends BaseBelt<Ring> {
    description: string = "Ring";

    getType(): string {
        return "Ring";
    }
}
