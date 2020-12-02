
export const orbitZones = {
    NA: "",
    STAR_INNER: "Inner Zone",
    STAR_OUTER: "Outer Zone",
    STAR_LIFE: "Life Zone"
}

export const planetaryTypes = {
    "Inner Zone": [
        { min: 1, max: 18, planetType: "Asteroid Belt", reRoll:false },
        { min: 19, max: 62, planetType: "Terrestrial", reRoll:false },
        { min: 63, max: 71, planetType: "Chunk", reRoll:false },
        { min: 72, max: 82, planetType: "Gas Giant", reRoll:false },
        { min: 83, max: 86, planetType: "Superjovian", reRoll:false },
        { min: 87, max: 96, planetType: "Empty Orbit", reRoll:false },
        { min: 97, max: 97, planetType: "Interloper", reRoll:true},
        { min: 98, max: 98, planetType: "Trojan", reRoll:true },
        { min: 99, max: 99, planetType: "Double Planet", reRoll:true },
        { min: 100, max: 100, planetType: "Captured Body", reRoll:true }
    ],
    "Life Zone": [
        { min: 1, max: 18, planetType: "Asteroid Belt", reRoll:false },
        { min: 19, max: 62, planetType: "Terrestrial", reRoll:false },
        { min: 63, max: 71, planetType: "Chunk", reRoll:false },
        { min: 72, max: 82, planetType: "Gas Giant", reRoll:false },
        { min: 83, max: 86, planetType: "Superjovian", reRoll:false },
        { min: 87, max: 96, planetType: "Empty Orbit", reRoll:false },
        { min: 97, max: 97, planetType: "Interloper", reRoll:true},
        { min: 98, max: 98, planetType: "Trojan", reRoll:true },
        { min: 99, max: 99, planetType: "Double Planet", reRoll:true },
        { min: 100, max: 100, planetType: "Captured Body", reRoll:true }
    ],
    "Outer Zone": [
        { min: 1, max: 15, planetType: "Asteroid Belt", reRoll:false },
        { min: 16, max: 23, planetType: "Terrestrial", reRoll:false },
        { min: 24, max: 35, planetType: "Chunk", reRoll:false },
        { min: 36, max: 74, planetType: "Gas Giant", reRoll:false },
        { min: 75, max: 84, planetType: "Superjovian", reRoll:false },
        { min: 85, max: 94, planetType: "Empty Orbit", reRoll:false },
        { min: 95, max: 95, planetType: "Interloper", reRoll:true },
        { min: 96, max: 97, planetType: "Trojan", reRoll:true },
        { min: 98, max: 99, planetType: "Double Planet", reRoll:true },
        { min: 100, max: 100, planetType: "Captured Body", reRoll:true }
    ],
    "Interloper": [
        { min: 1, max: 23, planetType: "Terrestrial", reRoll:false },
        { min: 24, max: 35, planetType: "Chunk", reRoll:false },
        { min: 36, max: 74, planetType: "Gas Giant", reRoll:false },
        { min: 75, max: 100, planetType: "Superjovian", reRoll:false }
    ],
    "Captured Body": [
        { min: 1, max: 62, planetType: "Terrestrial", reRoll:false },
        { min: 63, max: 71, planetType: "Chunk", reRoll:false },
        { min: 72, max: 82, planetType: "Gas Giant", reRoll:false },
        { min: 83, max: 86, planetType: "Superjovian", reRoll:false },
        { min: 87, max: 100, planetType: "Captured Body", reRoll:true },
    ],
    "Chunk": [
        { min: 1, max: 100, planetType: "Chunk", reRoll:false }
    ],
    "Trojan": [
        { min: 1, max: 62, planetType: "Terrestrial", reRoll:false },
        { min: 63, max: 71, planetType: "Chunk", reRoll:false },
        { min: 72, max: 82, planetType: "Gas Giant", reRoll:false },
        { min: 83, max: 86, planetType: "Superjovian", reRoll:false },
        { min: 87, max: 100, planetType: "Trojan", reRoll:true },
    ],
    "Double Planet": [
        { min: 1, max: 62, planetType: "Terrestrial", reRoll:false },
        { min: 63, max: 71, planetType: "Chunk", reRoll:false },
        { min: 72, max: 82, planetType: "Gas Giant", reRoll:false },
        { min: 83, max: 86, planetType: "Superjovian", reRoll:false },
        { min: 87, max: 100, planetType: "Double Planet", reRoll:true },
    ],
    "Ring": [
        { min: 1, max: 100, planetType: "Ring", reRoll:false }
    ],
}

export const planetaryRadius = {
    "Chunk": (d10A, d10B) => { return d10A * 200 },
    "Terrestrial": (d10A, d10B) => {
        let i = (d10A>=5) ? (d10A*1000) - 1000 : (d10A<=4) ? 3000 : 2000;
        let m = (d10A<=8) ? 100 : (d10A===9) ? 200 : 500;
        return i + d10B * m;
    },
    "Gas Giant": (d10A, d10B) => {
        let i = (d10A>5) ? ((d10A - 3) * 10000) - 1000 : 12000 + ( d10A * 3000 );
        let m  = (d10A>5) ? 1000 : 300;
        return i + d10B * m;
    }
}

export const planetaryDensity = {
    "Inner Zone": {
        "Chunk": (d10A) => {
            return 0.3 + d10A * 0.1;
        },
        "Terrestrial": (d10A) => {
            return 0.3 + d10A * 0.1;
        },
        "Gas Giant": (d10A) => {
            return 0.10 + d10A * 0.025;
        }
    },
    "Life Zone": {
        "Chunk": (d10A) => {
            return 0.3 + d10A * 0.1;
        },
        "Terrestrial": (d10A) => {
            return 0.3 + d10A * 0.1;
        },
        "Gas Giant": (d10A) => {
            return 0.10 + d10A * 0.025;
        }
    },
    "Outer Zone": {
        "Chunk": (d10A) => {
            return 0.1 + d10A * 0.05;
        },
        "Terrestrial": (d10A) => {
            return 0.1 + d10A * 0.05;
        },
        "Gas Giant": (d10A) => {
            return 0.08 + d10A * 0.025;
        }
    },
}

export class PlanetParams {
    solarDay: number = 0;
    planetTilt: number = 0;
    orbitalEccentricity: number = 0;
    closestSeparation: number = 0;
    furthestSeparation: number = 0;
    orbitalPeriod: number = 0;
    tidalForce: number = 0;
    tidalLock: number = 0;
    mass: number = 0;
    radius: number = 0;
    density: number = 0;
    gravity: number = 0;
    escape: number = 0;
}
