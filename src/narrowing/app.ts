function padLeft(padding: number | string, input: string): string {
    if(typeof padding === "number")
        return input.repeat(padding);
    return padding + input;
}

console.log(padLeft(2, "Abhishek"));
console.log(padLeft(5, "Abhishek"));
console.log(padLeft("Sharma", "Abhishek"));

function printAll(strs: string | string[] | null) {
    if(strs && typeof strs === "object") {
        for(const s of strs) {
            console.log(s);
        }
    } else if(typeof strs === "string") {
        console.log(strs);
        console.log("Length of string: " + strs.length);
    }
}

printAll("Abhishek");
printAll(["Ab", "hi", "sh", "ek"]);
printAll("");

// Don't do this
function printAllBad(strs: string | string[] | null) {
    // If strs were an empty string,
    // the method terminates
    if(strs) {
        if(typeof strs == "object") {
            for(const s of strs) {
                console.log(s);
            }
        
        // If strs were an empty string,
        // this case is never encountered.
        } else if(typeof strs === "string") {
            console.log(strs);
        }
    }
}

printAllBad("Abhishek");
printAllBad(["Ab", "hi", "sh", "ek"]);
printAllBad("");

function multiplyAll(
    values: number[] | undefined,
    factor: number): number[] | undefined {
    if(!values)
        return values;
    return values.map(value => value * factor);
}

console.log(multiplyAll(null, 2));
console.log(multiplyAll(undefined, 2));
console.log(multiplyAll([1,2,3,4,5], 2));

type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void, fly?: () => void }

function move(animal: Fish | Bird | Human) {
    if("swim" in animal && "fly" in animal)
        console.log("Human");
    else if("swim" in animal)
        console.log("Fish | Human"); // Fish | Human
    else
        console.log("Bird | Human"); // Bird | Human
}

move({swim: () => {}, fly: () => {}});
move({swim: () => {}});
move({fly: () => {}});

function logValue(value: Date | string) {
    if(value instanceof Date) {
        console.log(`Date: ${value.toUTCString()}`);
    } else {
        console.log(value);
    }
}

logValue(new Date());
logValue("date");

/************** Type Predicates ******************/

function isFish(animal: Fish | Bird): animal is Fish {
    return (animal as Fish).swim != undefined;
}

console.log(isFish({swim: () => {}}));
console.log(isFish({fly: () => {}}));

let fish = {
    swim: () => { 
        console.log("Fish swims");
    }
};
let bird = {
    fly: () => {
        console.log("Bird Flies");
    }
}

function doAction(animal : Fish | Bird) {
    if(isFish(animal)) {
        animal.swim();
    } else {
        animal.fly();
    }
}

doAction(fish);
doAction(bird);

const zoo: (Fish | Bird)[] = [fish, fish, bird, fish, bird, bird];

const fishes: Fish[] = zoo.filter(isFish);

console.log(zoo);
console.log(fishes);

/************ Using Ananonymous Predicate Method *******************/

type FishV2 = {
    name: string, 
    swim: () => void
};
type BirdV2 = {
    name?: string,
    fly: () => void
}

let birdV2 = {
    fly: () => {}
}

let fishV2_alex = {
    name: "Alex",
    swim: () => {}
}

let fishV2_bob = {
    name: "Bob",
    swim: () => {}
}

const zooV2: (FishV2 | BirdV2)[] = [fishV2_bob, fishV2_alex, birdV2, fishV2_bob, bird];

const bobFishes: (FishV2)[] = zooV2.filter((animal): animal is FishV2 => {
    if(animal.name && animal.name === "Alex") return false;
    return isFish(animal);
});

const alexFishes: (FishV2)[] = zooV2.filter((animal): animal is FishV2 => {
    if(animal.name && animal.name === "Bob") return false;
    return isFish(animal);
})

console.log(bobFishes);
console.log(alexFishes);

interface Circle {
    kind: "circle",
    radius: number
}
interface Square {
    kind: "square",
    length: number
}
type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch(shape.kind) {
        case "circle":
            return Math.PI * Math.pow(shape.radius, 2);
        case "square":
            return Math.pow(shape.length, 2);
    }
}

const circle: Circle = {
    kind: "circle",
    radius: 4
}
const square: Square = {
    kind: "square",
    length: 10
}

console.log(getArea(circle));
console.log(getArea(square));
