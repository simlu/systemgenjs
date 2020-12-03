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
                let orbitType = planetaryTypes[target[0]].find((val) => {
                    return (val.min <= roll && val.max >= roll);
                });
                console.log(target[0], orbitType);
                expect(orbitType.max).toBeDefined();
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
                orbitType: value,
                subType: "",
                gotType: "Planet",
                meanSeparation: i,
                orbitZone: "Test Zone " + i
            }
            pre.orbitType = expected.orbitType;
            pre.meanSeparation = expected.meanSeparation;
            pre.orbitZone = expected.orbitZone;
            i++;
            if (pre.orbitType === "Asteroid Belt") {
                post = new AsteroidBelt().import(pre);
                expected.gotType = "AsteroidBelt";
            } else if (pre.orbitType === "Ring") {
                post = new JunkRing().import(pre);
                expected.gotType = "JunkRing";
            } else if (pre.orbitType === "Interloper") {
                post = new Interloper().import(pre);
                expected.gotType = "Interloper";
                expected.subType = "Interloper";
                expected.orbitType = "";
                post.orbitType = pre.orbitSubType;
                post.orbitSubType = pre.orbitType;
            } else if (pre.orbitType === "Trojan") {
                post = new Trojan().import(pre);
                post.orbitType = pre.orbitSubType;
                post.orbitSubType = pre.orbitType;
                expected.gotType = "Trojan";
                expected.subType = "Trojan";
                expected.orbitType = "";
            } else if (pre.orbitType === "Double Planet") {
                post = new DoublePlanet().import(pre);
                post.orbitType = pre.orbitSubType;
                post.orbitSubType = pre.orbitType;
                expected.gotType = "DoublePlanet";
                expected.subType = "Double Planet";
                expected.orbitType = "";
            } else if (pre.orbitType === "Captured Body") {
                post = new CapturedBody().import(pre);
                post.orbitType = pre.orbitSubType;
                post.orbitSubType = pre.orbitType;
                expected.gotType = "CapturedBody";
                expected.subType = "Captured Body";
                expected.orbitType = "";
            } else {
                post = pre;
            }
            expect(post.orbitType).toBe(expected.orbitType);
            expect(post.orbitSubType).toBe(expected.subType);
            expect(post.getType()).toBe(expected.gotType);
            expect(post.meanSeparation).toBe(expected.meanSeparation);
            expect(post.orbitZone).toBe(expected.orbitZone);
        });


    },
);




