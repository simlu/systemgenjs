import BaseOrbitsPlanet from "./base-orbits-planet";
import BaseOrbitsStar from "./base-orbits-star";

export default class BaseBelt<T> extends BaseOrbitsStar<T>{
    description:string;
    poi:BaseOrbitsPlanet<any>[];
}
