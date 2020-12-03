import {planetaryTypes} from "../../../tables/planetary-data-tables";
import AsteroidBelt from "../../../components/asteroid-belt";
import JunkRing from "../../../components/junk-ring";
import Interloper from "../../../components/interloper";
import Trojan from "../../../components/trojan";
import DoublePlanet from "../../../components/double-planet";
import CapturedBody from "../../../components/captured-body";
import Planet from "../../../components/planet";

test(
    'Check initial star gen', () => {
        Object.entries(planetaryTypes).forEach((target) => {
            for (let roll = 1; roll <= 100; roll++) {
                let planetType = planetaryTypes[target[0]].find((val) => {
                    return (val.min <= roll && val.max >= roll);
                });
                expect(planetType.max).toBeDefined();
            }
        });
    },
);

test(
    'Confirm Object convert data', () => {
        let pre = new Planet();
        let post;
        let i = 1;
        ["Asteroid Belt", "JunkRing", "Interloper", "Trojan", "Double Planet", "Captured Body", "Planet"].forEach((value) => {
            let expected = {
                planetType: value,
                subType: "",
                gotType: "Planet",
                meanSeparation: i,
                orbitZone: "Test Zone " + i
            }
            pre.planetType = expected.planetType;
            pre.meanSeparation = expected.meanSeparation;
            pre.orbitZone = expected.orbitZone;
            i++;
            if (pre.planetType === "Asteroid Belt") {
                post = new AsteroidBelt();
                post.meanSeparation = pre.meanSeparation;
                post.orbitZone = pre.orbitZone;
                expected.planetType = undefined;
                expected.subType = undefined;
                expected.gotType = "AsteroidBelt";
            } else if (pre.planetType === "Ring") {
                post = new JunkRing();
                post.meanSeparation = pre.meanSeparation;
                post.orbitZone = pre.orbitZone;
                expected.planetType = undefined;
                expected.subType = undefined;
                expected.gotType = "JunkRing";
            } else if (pre.planetType === "Interloper") {
                post = new Interloper().update(pre);
                expected.gotType = "Interloper";
                expected.subType = "Interloper";
                expected.planetType = "";
                post.planetType = pre.planetSubType;
                post.planetSubType = pre.planetType;
            } else if (pre.planetType === "Trojan") {
                post = new Trojan().update(pre);
                post.planetType = pre.planetSubType;
                post.planetSubType = pre.planetType;
                expected.gotType = "Trojan";
                expected.subType = "Trojan";
                expected.planetType = "";
            } else if (pre.planetType === "Double Planet") {
                post = new DoublePlanet().update(pre);
                post.planetType = pre.planetSubType;
                post.planetSubType = pre.planetType;
                expected.gotType = "DoublePlanet";
                expected.subType = "Double Planet";
                expected.planetType = "";
            } else if (pre.planetType === "Captured Body") {
                post = new CapturedBody().update(pre);
                post.planetType = pre.planetSubType;
                post.planetSubType = pre.planetType;
                expected.gotType = "CapturedBody";
                expected.subType = "Captured Body";
                expected.planetType = "";
            } else {
                post = pre;
            }
            expect(post.planetType).toBe(expected.planetType);
            expect(post.planetSubType).toBe(expected.subType);
            expect(post.getType()).toBe(expected.gotType);
            expect(post.meanSeparation).toBe(expected.meanSeparation);
            expect(post.orbitZone).toBe(expected.orbitZone);
        });


    },
);




