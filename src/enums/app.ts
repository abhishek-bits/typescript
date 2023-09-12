// an enum not marked as const
enum Enum {
    A
}

let indexOfA = Enum.A;
let nameOfA = Enum[indexOfA];

console.log(indexOfA + " of type: " + typeof indexOfA);
console.log(nameOfA + " of type: " + typeof nameOfA);

/************************************
 * Making Objects work same as Enums.
 ************************************/

// Declaring an Enum
const enum EDirection {
    Up,
    Down,
    Left,
    Right
}

// Declaring an Object
const ODirection = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
} as const;

// Using Enum as parameter
function walk(dirIndex: EDirection) {
    console.log(dirIndex);
}

// Using Object as parameter
type DirectionIndexes = typeof ODirection[keyof typeof ODirection];

function run(dirIndex: DirectionIndexes) {
    console.log(dirIndex);
}

walk(EDirection.Right);
run(ODirection.Right);
