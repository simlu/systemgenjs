import IGeneratorPart from "../../interfaces/generator-part";
import System from "../../components/system";
import {sepTypes} from "../../tables/stella-data-tables";
import {getPathsFromValue} from "../../system-gen-utils";
import Star from "../../components/star";

export default class MultipleStars implements IGeneratorPart {
    roller: (rollFormat: string) => number;

    run(system: System): System {
        system = this.setOrbitPosition(system);
        system.orbits = this.calculateOrbitalPeriod(system.orbits);
        system.starPaths = getPathsFromValue(system.orbits, "**.starAge", "starAge");
        return system;
    }

    calculateOrbitalPeriod(orbits: Star[]): Star[] {
        let primaryMass = this.getMass(orbits[0]);
        if (orbits[0].orbits.length > 0) {
            orbits[0].orbits = this.getOrbitalPeriod(<Star[]>orbits[0].orbits, orbits[0].mass);
        }
        for (let i = 1; i < orbits.length; i++) {
            if (orbits[i].orbits instanceof Star) {
                orbits[i].orbits = this.getOrbitalPeriod(<Star[]>orbits[i].orbits, primaryMass);
            }
        }
        return orbits;
    }

    getOrbitalPeriod(orbits: Star[], parentMass: number = 0): Star[] {
        for (let i = 0; i < orbits.length; i++) {
            orbits[i].orbitalPeriod = Math.pow(orbits[i].meanSeparation, 3) / Math.pow((parentMass + this.getMass(orbits[i])), 0.5);
            if (orbits[i].orbits.length > 0) {
                if (orbits[i].orbits instanceof Star) {
                    orbits[i].orbits = this.getOrbitalPeriod(<Star[]>orbits[i].orbits, orbits[i].mass);
                }
            }
        }
        return orbits;
    }

    getMass(orbit: Star): number {
        let mass = orbit.mass;
        orbit.orbits.forEach((child, i) => {
            if (child instanceof Star) {
                mass += this.getMass(child);
            }
        });
        return mass;
    }

    setOrbitPosition(system: System): System {
        let primaries = system.orbits;
        system.orbits = [];
        switch (primaries.length) {
            case 1:
                system = this.setSingleOrbit(system, primaries);
                break;
            case 2:
                system = this.setDoubleOrbit(system, primaries);
                break;
            case 3:
                system = this.setTripleOrbit(system, primaries);
                break;
            case 4:
                system = this.setQuadrupleOrbit(system, primaries);
            default:
                system.orbits = primaries;//restore back as we don't deal with this many
        }

        return system;
    }

    setSingleOrbit(system: System, primaries: Star[]): System {
        system.orbits.push(primaries[0]);
        return system;
    }

    setDoubleOrbit(system: System, primaries: Star[]): System {
        system = this.setSingleOrbit(system, primaries);
        let sep = this.calcSep();
        primaries[1] = this.fillInSepValues(primaries[1], sep);
        if (sep < sepTypes.SEPARATED) {
            system.orbits[0].orbits.push(primaries[1]);
        } else {
            system.orbits.push(primaries[1]);
        }
        return system;
    }

    setTripleOrbit(system: System, primaries: Star[]): System {
        system = this.setDoubleOrbit(system, primaries);
        let sep = this.calcSep();
        let slot = 0;
        let roll = this.roller("d10");
        primaries[2] = this.fillInSepValues(primaries[2], sep);
        if (system.orbits.length > 1) {
            if (sep < sepTypes.SEPARATED) {
                slot = (roll <= 5) ? 0 : 1;
                system.orbits[slot].orbits.push(primaries[2]);
            } else {
                system.orbits.push(primaries[2]);
            }
        } else {
            if (sep < sepTypes.SEPARATED) {
                if ((roll <= 7) ? 0 : 1) {
                    system.orbits[0].orbits.push(primaries[2]);
                } else {
                    system.orbits[0].orbits[0].orbits.push(primaries[2]);
                }
            } else {
                system.orbits.push(primaries[2]);
            }
        }
        return system;
    }

    setQuadrupleOrbit(system: System, primaries: Star[]): System {
        system = this.setTripleOrbit(system, primaries);
        let sep = this.calcSep();
        let roll = this.roller("d10");
        let slot = (roll <= 4) ? 0 : (roll <= 7) ? 1 : 2;
        if (system.orbits.length === 3) {
            sep = this.calcSep("d6");
            primaries[3] = this.fillInSepValues(primaries[3], sep);
            system.orbits[slot].orbits.push(primaries[3]);
        } else if (system.orbits.length === 2) {
            sep = this.calcSep("d6");
            primaries[3] = this.fillInSepValues(primaries[3], sep);
            if (system.orbits[0].orbits.length > 0) {
                system.orbits[1].orbits.push(primaries[3]);
            } else {
                system.orbits[0].orbits.push(primaries[3]);
            }
        } else if (system.orbits.length === 1) {
            sep = this.calcSep("d6");
            primaries[3] = this.fillInSepValues(primaries[3], sep);
            if (slot === 0) {
                system.orbits[0].orbits.push(primaries[3]);
            } else {
                slot = slot - 1;
                if (system.orbits[0].orbits.length === 1) {
                    system.orbits[0].orbits[0].orbits[0].orbits.push(primaries[3]);
                } else {
                    system.orbits[0].orbits[slot].orbits.push(primaries[3]);
                }

            }
        }
        return system;
    }

    calcSep(format = "d10") {
        let roll = this.roller(format);

        let result = sepTypes.VERY_CLOSE;
        switch (roll) {
            case 3:
                result = sepTypes.VERY_CLOSE;
                break;
            case 4:
            case 5:
            case 6:
                result = sepTypes.CLOSE;
                break;
            case 7:
            case 8:
                result = sepTypes.SEPARATED;
                break;
            case 9:
                result = sepTypes.DISTANT;
                break;
            default:
                result = sepTypes.EXTREME;
                break;
        }

        return result;
    }

    fillInSepValues(orbit: Star, sep): Star {
        let mod = orbit.starAge > 5 ? 1 : orbit.starAge <= 1 ? -1 : 0;
        orbit.meanSeparation = this.roller('d10');
        orbit.meanSeparation = ((orbit.meanSeparation + mod) > 10 || (orbit.meanSeparation + mod) < 1) ? orbit.meanSeparation : orbit.meanSeparation + mod;
        mod = 0;
        switch (sep) {
            case 3:
                orbit.separation = "Very Close";
                orbit.meanSeparation *= 0.05;
                mod = -2;
                break;
            case 6:
                orbit.separation = "Close";
                orbit.meanSeparation *= 0.5;
                mod = -1;
                break;
            case 8:
                orbit.separation = "Separated";
                orbit.meanSeparation *= 3;
                break;
            case 9:
                orbit.separation = "Distant";
                orbit.meanSeparation *= 20;
                break;
            case 10:
                orbit.separation = "Extreme";
                orbit.meanSeparation = this.roller('d100');
                orbit.meanSeparation *= 200;
                break;
        }
        orbit.orbitalEccentricity = this.calculateEccentricity(mod);
        orbit.closestSeparation = orbit.meanSeparation * (1 - orbit.orbitalEccentricity);
        orbit.furthestSeparation = orbit.meanSeparation * (1 + orbit.orbitalEccentricity);
        return orbit;
    }

    calculateEccentricity(mod: number) {
        let d10A = this.roller("d10");
        d10A = ((d10A + mod) < 1 || (d10A + mod) > 10) ? d10A : d10A + mod;
        let d10B = this.roller("d10");
        let ecc = 0;
        if (d10A <= 2) {
            ecc = 0.01 * d10B;
        } else if (d10A <= 4) {
            ecc = 0.1 + (0.01 * d10B);
        } else if (d10A <= 6) {
            ecc = 0.2 + (0.01 * d10B);
        } else if (d10A <= 8) {
            ecc = 0.3 + (0.01 * d10B);
        } else if (d10A === 9) {
            ecc = 0.4 + (0.01 * d10B);
        } else if (d10A === 10) {
            ecc = 0.5 + (0.01 * d10B);
        }

        return ecc;
    }

    setRoller(callback: (rollFormat: string) => number): MultipleStars {
        this.roller = callback;
        return this;
    }

}
