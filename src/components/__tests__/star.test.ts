import Star from "../star";

test('Stella Star - star should map correctly', () => {
        let star = new Star();
        let obj = {min: 1, max: 1,    starAge:0, spectralClass: "A", spectralRanking:0, starDesc: "", sizeClass: "V", specTarget: 7, lum:0, mass:0, temp:0, rad:0};

        expect(star.starAge).toBe(0);
        star.map(obj);
        expect(obj.spectralClass).toBe(star.spectralClass);
});
