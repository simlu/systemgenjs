import {planetaryTypes} from "../../../tables/planetary-data-tables";

test(
    'Check initial star gen', () => {
        Object.entries(planetaryTypes).forEach((target) => {
            for( let roll = 1; roll<= 100; roll++) {
                let planetType = planetaryTypes[target[0]].find((val) => {
                    return (val.min <= roll && val.max >= roll);
                });
                expect(planetType.max).toBeDefined();
            }
        });
    },
);
