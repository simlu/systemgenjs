export class StarMap {
    min: number;
    max: number;
    starAge: number;
    spectralClass: string;
    spectralRanking: number;
    starDesc: string;
    sizeClass: string;
    specTarget: number;
    lum: number;
    mass: number;
    temp: number;
    rad: number;

    public constructor(init?: Partial<StarMap>) {
        Object.assign(this, init);
    }
}

export const starMaps: StarMap[] = [
    new StarMap({
        min: 1,
        max: 1,
        starAge: 0,
        spectralClass: "A",
        spectralRanking: 0,
        starDesc: "",
        sizeClass: "V",
        specTarget: 7,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 2,
        max: 4,
        starAge: 0,
        spectralClass: "F",
        spectralRanking: 0,
        starDesc: "",
        sizeClass: "V",
        specTarget: 9,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 5,
        max: 12,
        starAge: 0,
        spectralClass: "G",
        spectralRanking: 0,
        starDesc: "",
        sizeClass: "V",
        specTarget: 10,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 13,
        max: 26,
        starAge: 0,
        spectralClass: "K",
        spectralRanking: 0,
        starDesc: "",
        sizeClass: "V",
        specTarget: 0,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 27,
        max: 36,
        starAge: 0,
        spectralClass: "WD",
        spectralRanking: 0,
        starDesc: "White Dwarf",
        sizeClass: "VII",
        specTarget: 0,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 37,
        max: 86,
        starAge: 0,
        spectralClass: "M",
        spectralRanking: 0,
        starDesc: "",
        sizeClass: "V",
        specTarget: 0,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 86,
        max: 98,
        starAge: 0,
        spectralClass: "BD",
        spectralRanking: 0,
        starDesc: "Brown Dwarf",
        sizeClass: "",
        specTarget: 0,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    new StarMap({
        min: 99,
        max: 100,
        starAge: 0,
        spectralClass: "Gi",
        spectralRanking: 0,
        starDesc: "Giant",
        sizeClass: "III",
        specTarget: -1,
        lum: 0,
        mass: 0,
        temp: 0,
        rad: 0
    }),
    //new StarMap({min: 100, max: 100, starAge:0, spectralClass: "S", spectralRanking:0, starDesc: "Special", sizeClass: "V", specTarget: -2, lum:0, mass:0, temp:0, rad:0}),
];

export class LumMassTempRad {
    spectralClass: string;
    sizeClass: string;
    lum: number[];
    mass: number[];
    temp: number[];
    rad: number[];

    public constructor(init?: Partial<LumMassTempRad>) {
        Object.assign(this, init);
    }
}

export const lumMassTempRads: LumMassTempRad[] = [
    new LumMassTempRad({
        spectralClass: "B",
        sizeClass: "V",
        lum: [13000, 7800, 4700, 2800, 1700, 1000, 600, 370, 220, 130],
        mass: [17.5, 15.1, 13.0, 11.1, 9.5, 8.2, 7.0, 6.0, 5.0, 4.0],
        temp: [28000, 25000, 22000, 19000, 17000, 15000, 14000, 13000, 12000, 11000],
        rad: [4.9, 4.8, 4.8, 4.8, 4.8, 4.7, 4.2, 3.8, 3.5, 3.2]
    }),
    new LumMassTempRad({
        spectralClass: "A",
        sizeClass: "V",
        lum: [80, 62, 48, 38, 29, 23, 18, 14, 11, 8.2],
        mass: [3.0, 2.8, 2.6, 2.5, 2.3, 2.2, 2.0, 1.9, 1.8, 1.7],
        temp: [10000, 9750, 9500, 9250, 9000, 8750, 8500, 8250, 8000, 7750],
        rad: [3, 2.8, 2.6, 2.4, 2.2, 2.1, 2.0, 1.8, 1.7, 1.6]
    }),
    new LumMassTempRad({
        spectralClass: "F",
        sizeClass: "V",
        lum: [6.4, 5.5, 4.7, 4.0, 3.4, 2.9, 2.5, 2.16, 1.85, 1.58],
        mass: [1.6, 1.53, 1.47, 1.42, 1.36, 1.31, 1.26, 1.21, 1.17, 1.12],
        temp: [7500, 7350, 7200, 7050, 6900, 6750, 6600, 6450, 6300, 6150],
        rad: [1.5, 1.5, 1.4, 1.4, 1.3, 1.3, 1.2, 1.2, 1.2, 1.1]
    }),
    new LumMassTempRad({
        spectralClass: "G",
        sizeClass: "V",
        lum: [1.36, 1.21, 1.09, 0.98, 0.88, 0.79, 0.71, 0.64, 0.57, 0.51],
        mass: [1.08, 1.05, 1.02, 0.99, 0.96, 0.94, 0.92, 0.87, 0.87, 0.85],
        temp: [6000, 5900, 5800, 5700, 5600, 5500, 5400, 5300, 5200, 5100],
        rad: [1.1, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.9]
    }),
    new LumMassTempRad({
        spectralClass: "K",
        sizeClass: "V",
        lum: [0.46, 0.39, 0.32, 0.27, 0.23, 0.19, 0.16, 0.14, 0.11, 0.10],
        mass: [0.82, 0.79, 0.75, 0.72, 0.69, 0.66, 0.63, 0.61, 0.56, 0.49],
        temp: [5000, 4850, 4700, 4550, 4400, 4250, 4100, 3950, 3800, 3650],
        rad: [0.9, 0.9, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]
    }),
    new LumMassTempRad({
        spectralClass: "M",
        sizeClass: "V",
        lum: [0.08, 0.04, 0.02, 0.012, 0.006, 0.003, 0.0017, 0.0009, 0.0005, 0.0002],
        mass: [0.46, 0.38, 0.32, 0.26, 0.21, 0.18, 0.15, 0.12, 0.10, 0.08],
        temp: [3500, 3350, 3200, 3050, 2900, 2750, 2600, 2450, 2300, 2200],
        rad: [0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.17, 0.14, 0.11]
    }),
    new LumMassTempRad({
        spectralClass: "A",
        sizeClass: "IV",
        lum: [156, 127, 102, 83, 67, 54, 44, 36, 29, 23],
        mass: [6, 5.1, 4.6, 4.3, 4.0, 3.7, 3.4, 3.1, 2.9, 2.7],
        temp: [9700, 9450, 9200, 8950, 8700, 8450, 8200, 7950, 7700, 7500],
        rad: [4.5, 4.2, 4.0, 3.8, 3.6, 3.5, 3.2, 3.1, 2.9]
    }),
    new LumMassTempRad({
        spectralClass: "F",
        sizeClass: "IV",
        lum: [19, 16.9, 15.1, 13.4, 12.0, 10.7, 9.5, 8.5, 7.6, 6.7],
        mass: [2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.95, 1.9, 1.8, 1.7],
        temp: [7300, 7200, 7100, 6950, 6800, 6650, 6500, 6350, 6200, 6050],
        rad: [2.7, 2.7, 2.6, 2.6, 2.5, 2.5, 2.5, 2.5, 2.4, 2.4]
    }),
    new LumMassTempRad({
        spectralClass: "G",
        sizeClass: "IV",
        lum: [6.2, 5.9, 5.6, 5.4, 5.2, 5.0, 4.8, 4.6, 4.4, 4.2],
        mass: [1.60, 1.55, 1.52, 1.49, 1.47, 1.45, 1.44, 1.43, 1.42, 1.41],
        temp: [5900, 5750, 5600, 5450, 5300, 5200, 5100, 5000, 4900, 4800],
        rad: [2.4, 2.4, 2.5, 2.6, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0]
    }),
    new LumMassTempRad({
        spectralClass: "K",
        sizeClass: "IV",
        lum: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        mass: [1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40],
        temp: [4700, 4700, 4700, 4700, 4700, 4700, 4700, 4700, 4700, 4700],
        rad: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0]
    }),
    new LumMassTempRad({
        spectralClass: "A",
        sizeClass: "III",
        lum: [280, 240, 200, 170, 140, 120, 100, 87, 74, 63],
        mass: [12, 11.5, 11.0, 10.5, 10, 9.6, 9.2, 8.9, 8.6, 8.3],
        temp: [9500, 9250, 9000, 8750, 8500, 8250, 8000, 7750, 7500, 7350],
        rad: [6.2, 6.1, 5.9, 5.7, 5.6, 5.5, 5.3, 5.2, 5.1, 4.9]
    }),
    new LumMassTempRad({
        spectralClass: "F",
        sizeClass: "III",
        lum: [53, 51, 49, 47, 46, 45, 46, 47, 48, 49],
        mass: [8.0, 7.0, 6.0, 5.2, 4.7, 4.3, 3.9, 3.5, 3.1, 2.8],
        temp: [7200, 7050, 6900, 6750, 6600, 6450, 6300, 6150, 6000, 5900],
        rad: [4.7, 4.8, 4.9, 5.1, 5.2, 5.4, 5.7, 6.1, 6.5, 6.8]
    }),
    new LumMassTempRad({
        spectralClass: "G",
        sizeClass: "III",
        lum: [50, 55, 60, 65, 70, 77, 85, 92, 101, 110],
        mass: [2.5, 2.4, 2.5, 2.5, 2.6, 2.7, 2.7, 2.8, 2.8, 2.9],
        temp: [5800, 5700, 5600, 5500, 5400, 5250, 5100, 4950, 4800, 4650],
        rad: [7.1, 7.7, 8.3, 9.0, 9.7, 10.7, 11.9, 13.2, 14.7, 16.3]
    }),
    new LumMassTempRad({
        spectralClass: "K",
        sizeClass: "III",
        lum: [120, 140, 160, 180, 210, 240, 270, 310, 360, 410],
        mass: [3, 3.3, 3.6, 3.9, 4.2, 4.5, 4.8, 5.1, 5.4, 5.8],
        temp: [4500, 4400, 4300, 4200, 4100, 4000, 3900, 3800, 3700, 3550],
        rad: [18.2, 20.4, 22.8, 25.6, 28.8, 32.4, 36.5, 41.2, 46.5, 54]
    }),
    new LumMassTempRad({
        spectralClass: "M",
        sizeClass: "III",
        lum: [470, 600, 900, 1300, 1800, 2300, 2400, 2500, 2600, 2700],
        mass: [6.2, 6.4, 6.6, 6.8, 7.2, 7.4, 7.8, 8.3, 8.8, 9.3],
        temp: [3400, 3200, 3100, 3000, 2800, 2650, 2500, 2400, 2300, 2200],
        rad: [63, 80, 105, 135, 180, 230, 260, 290, 325, 260]
    }),
];

export class Abundance {
    min: number = 0;
    max: number = 0;
    desc: string = "";
    mod: number = 0;

    public constructor(init?: Partial<Abundance>) {
        Object.assign(this, init);
    }
}

export const abundances = [
    new Abundance({min: 3, max: 9, desc: "Exceptional", mod: 2}),
    new Abundance({min: 10, max: 12, desc: "High", mod: 1}),
    new Abundance({min: 13, max: 18, desc: "Normal", mod: 0}),
    new Abundance({min: 19, max: 21, desc: "Poor", mod: -1}),
    new Abundance({min: 22, max: 200, desc: "Depleted", mod: -3})
]

export const whiteDwarf = [
    {mass: 1.3, rad: 0.004, temp: 30000},
    {mass: 1.1, rad: 0.007, temp: 25000},
    {mass: 0.9, rad: 0.009, temp: 20000},
    {mass: 0.7, rad: 0.010, temp: 16000},
    {mass: 0.6, rad: 0.011, temp: 14000},
    {mass: 0.55, rad: 0.012, temp: 12000},
    {mass: 0.5, rad: 0.013, temp: 10000},
    {mass: 0.45, rad: 0.014, temp: 8000},
    {mass: 0.4, rad: 0.015, temp: 6000},
    {mass: 0.35, rad: 0.016, temp: 4000}
];

export const brownDwarf = [
    {mass: 0.070, rad: 0.07, temp: 2200},
    {mass: 0.064, rad: 0.08, temp: 2000},
    {mass: 0.058, rad: 0.09, temp: 1800},
    {mass: 0.052, rad: 0.10, temp: 1600},
    {mass: 0.046, rad: 0.11, temp: 1400},
    {mass: 0.040, rad: 0.12, temp: 1200},
    {mass: 0.034, rad: 0.12, temp: 1000},
    {mass: 0.026, rad: 0.12, temp: 900},
    {mass: 0.020, rad: 0.12, temp: 800},
    {mass: 0.014, rad: 0.12, temp: 700}
];

export class StarAge {
    spectralClass: string;
    minRanking: number;
    maxRanking: number;
    age: number[];
    mod: number[];
    life: number;

    public constructor(init?: Partial<StarAge>) {
        Object.assign(this, init);
    }
}

export const starAges = [
    new StarAge({spectralClass: "B", minRanking: 0, maxRanking: 9, age: [], mod: [], life: 0.1}),
    new StarAge({
        spectralClass: "A",
        minRanking: 0,
        maxRanking: 4,
        age: [0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.5, 0.6],
        mod: [],
        life: 0.6
    }),
    new StarAge({
        spectralClass: "A",
        minRanking: 5,
        maxRanking: 9,
        age: [0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2],
        mod: [-20, -20, -10, -10, 0, 0, 10, 10, 20, 20],
        life: 1.3
    }),
    new StarAge({
        spectralClass: "F",
        minRanking: 0,
        maxRanking: 4,
        age: [0.3, 0.6, 1.0, 1.3, 1.6, 2.0, 2.3, 2.6, 2.9, 3.2],
        mod: [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50],
        life: 3.2
    }),
    new StarAge({
        spectralClass: "F",
        minRanking: 5,
        maxRanking: 9,
        age: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
        mod: [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50],
        life: 5.6
    }),
    new StarAge({
        spectralClass: "G",
        minRanking: 0,
        maxRanking: 4,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50],
        life: 10
    }),
    new StarAge({
        spectralClass: "G",
        minRanking: 5,
        maxRanking: 9,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [-40, -30, -20, -10, 0, 0, 0, 10, 20, 30],
        life: 14
    }),
    new StarAge({
        spectralClass: "K",
        minRanking: 0,
        maxRanking: 4,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [-20, -15, -10, -5, 0, 0, 0, 0, 0, 5],
        life: 23
    }),
    new StarAge({
        spectralClass: "K",
        minRanking: 5,
        maxRanking: 9,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [-10, -15, 0, 0, 0, 0, 0, 0, 0, 0],
        life: 42
    }),
    new StarAge({
        spectralClass: "M",
        minRanking: 0,
        maxRanking: 9,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [-10, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        life: 50
    }),
    new StarAge({
        spectralClass: "WD",
        minRanking: 0,
        maxRanking: 9,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [-4, -4, -3, -3, -2, -2, -1, -1, 0, 0],
        life: 0
    }),
    new StarAge({
        spectralClass: "BD",
        minRanking: 0,
        maxRanking: 9,
        age: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        mod: [0, 1, 1, 2, 2, 3, 4, 5, 6, 7],
        life: 0
    }),
];

export const sepTypes = {
    NA: -1,
    VERY_CLOSE: 3,
    CLOSE: 6,
    SEPARATED: 8,
    DISTANT: 9,
    EXTREME: 10
}
