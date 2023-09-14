function greeter(fn: (a: string) => void) {
    fn("Hello World");
}

function printToConsole(s: string) {
    console.log(s);
}

greeter(printToConsole);

/************ Call Signature ************/

type DescribableFunction = {
    // Add properties
    description: string,
    // ...

    // Add Call Signature
    (arg: number): boolean
}

function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6));
}

// Would still compile if return type is not boolean
// But may return undefined in that case.
function isGreaterThan3(arg: number): boolean {
    return arg > 3;
}

// Error: Property "description" is missing
// doSomething(isGreaterThan3);

// Initializing property to function
isGreaterThan3.description = "Is greater than 3";

// OK!
doSomething(isGreaterThan3);

/*********** Construct Signature ***********/

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

type PointConstructor = {
    new (x: number, y: number): Point
}

function getPoint(pointConstructor: PointConstructor): Point {
    return new pointConstructor(5, 6);
}

// Create an object of Point using PointConstructor
const pointFactory: PointConstructor = Point;

// const point = new pointFactory(5, 6);
const point = getPoint(pointFactory);

console.log(`x = ${point.x}, y = ${point.y}`);

/***************** Generic Functions *************/

function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

// s is of type string
const s = firstElement(["a", "b", "c"]);
// n is of type number
const n = firstElement([1,2,3]);
// u is of type undefined
const u = firstElement([]);

console.log(`s: ${s} of type: ${typeof s}`);
console.log(`n: ${n} of type: ${typeof n}`);
console.log(`u: ${u} of type: ${typeof u}`);


function map<K, V>(arr: K[], fn: (n: K) => V): V[] {
    return arr.map(fn);
}

const arr: string[] = ["10", "12", "14", "16"];
const fn = (n: string) => parseInt(n);

// const numArr: number[] = map(arr, (n) => parseInt(n));
const numArr: number[] = map(arr, fn);

console.log(numArr);

function longest<T extends number>(a: T, b: T): T {
    if(a > b)
        return a;
    return b;
}

// OK!
console.log(longest(5, 8));
// OK!
console.log(longest(15.788, 11.987));
// Error!
// console.log(longest("", ""));

// Any type that has length property
function longestArray<T extends { length: number }>(a: T, b: T): T {
    if(a.length > b.length)
        return a;
    return b;
}

// OK!
console.log(longestArray([1,2,3], [4,5]));
// OK!
console.log(longestArray(["Ab", "Hi"], ["Shek", "Shar", "Ma"]));
// OK! (String has length property)
console.log(longestArray("abhishek", "sharma"));


// DON'T DO THIS!
function minimumLength<T extends { length: number}>(obj: T, minimumLen: number) {
    if(obj.length >= minimumLen) {
        return obj;
    }
    return { minimumLength: minimumLen };
}

console.log(minimumLength([1,2,3,4,5,6], 3));
console.log(minimumLength([1,2,3], 6));

/********** Specifying type arguments **********/

function combine<T>(a: T[], b: T[]): T[] {
    return a.concat(b);
}

// OK!
console.log(combine([1,2,3], [4,5,6]));
// OK!
console.log(combine(["A", "B", "C"], ["a", "b", "c"]));
// Specifying type arguments
console.log(combine<number | string>([1,2,3], ["A", "B", "C"]));

/************ DO NOT USE! Optional Parameters *************/

function myForEach(arr: any[], fn: (arg: any, index?: number) => void) {
    for(var i = 0; i < arr.length; i++) {
        // Even though we have called both the parameters.
        fn(arr[i], i);
    }
}

myForEach([1,2,3], (a) => console.log(a));
// Still, the invocation complains that 'i' may be undefined.
// myForEach([1,2,3], (a, i) => console.log(a, i.toFixed()));

// Because, this is what JavaScript infers from our optional notation:
function inferredMyForEach(arr: any[], fn: (arg: any, index?: number) => void) {
    for(var i = 0; i < arr.length; i++) {
        fn(arr[i]);
    }
}

/********** Function Overloading *************/

// Declarations
function makeDate(timestamp: number): Date;
function makeDate(day: number, month: number, year: number): Date;

// Definition
function makeDate(dayOrTimestamp: number, month?: number, year?: number): Date {
    if(month && year) {
        return new Date(year, month, dayOrTimestamp);
    } else {
        return new Date(dayOrTimestamp);
    }
}

console.log(makeDate(Date.now()));
console.log(makeDate(13, 9, 2023));


function func(x: boolean): void;
function func(x: string): boolean;

function func(x: string | boolean): void | boolean {

}

/*************** Rest Parameters and Aguments ****************/

function multiply(n: number, arr: number[]): number[] {
    return arr.map((item) => item * n);
}

console.log(multiply(10, [1,2,3,4]));

function multiplyRestParam(n: number, ...m: number[]) {
    return m.map((x) => x * n);
}

console.log(multiply(10, [1,2,3,4]));

const arr1 = [1,2,3];
const arr2 = [4,5];

// push accepts any number of arguments
arr1.push(...arr2);

console.log(arr1);

// Complains that the Rest Argument must be a tuple type.
// const angle = Math.atan2(...arr2);

const args = [4,5] as const;

// OK!
const angle = Math.atan2(...args);

/*********** Functions with void **************/

type voidFunction = () => void;

// OK!
const f1: voidFunction = () => {
    return true; // Ignored.
}

const val = f1;

console.log(typeof(val));

// Literal function definitions don't allow 
// us to return anything.
function f2(): void {
    // Error!
    // return true;
}
