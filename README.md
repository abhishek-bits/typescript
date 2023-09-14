# TypeScript

Reference: [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

- The more **statically typed** our program is, the more validation and tooling we'll get, meaning less bugs.

## Installing the TypeScript compiler

```shell
npm install -g typescript
```

## Running first TypeScript script

File name: `hello.ts`

```ts
// Greets the world.
console.log("Hello world!");
```

Run command:
```shell
tsc hello.ts
```

If the above command fails, try: `tsc.cmd hello.ts`

This command:
- does not executes the code but instead converts it into a `JavaScript` file.
- does the compile time checking of the code, including arguments passed to the method.

However, even if there are mistakes (errors) that typechecker reports, the TypeScript would still go ahead and create `.js` file for us.
In order to avoid this from happening, we can apply `noEmitOnError` flag as shown:

```shell
tsc --noEmitOnError hello.ts
```

## Type checking

### Explicit types

Adding type annotations on `person` and `date` to describe explicitly what `greet` can be called with.

```ts
function greet(person: string, date: Date) {
	console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

On compiling the above code, the TypeScript compiler converts to the following JavaScript code:

```js
"using strict";
function greet(person, date) {
	console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}
```

- `person` and `date` parameters no longer have type annotations.
- The template string (within backticks character ` )  was converted to plain strings with annotations.

Typescript has the ability to rewrite code from newer versions of `ECMAScript` to older versions such as `ECMAScript3` or `ECMAScript5` (a.k.a. `ES3` and `ES5`).
By default, TypeScript targets `ES3`, an extremely old version of ECMAScript, we can use specific flag to target a specific version as shown:

By running the following command:

```shell
tsc --target es2015 hello.ts
```

We get the below JavaScript code:

```js
function greet(person, date) {
	console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

```js
greet("Maddison", Date()); 		// Error, Date() returns a string
greet("Maddison", new Date());	// new Date() returns Date type
```

**NOTE**:
- Type annotations are not part of JavaScript (or ECMAScript), so browsers cannot understand those.
- It's best not to add annotations when the type system would end up inferring the same type anyway.
- While the default target is ES3, the great majority of current browsers support ES2015.

**REMEMBER**:
Type annotations never change the runtime behavior of your program.

### Strictness

TS has serveral type-checking strictness flags that can be turned on or off. The strict flag in the CLI, or `"strict": true` in a **tsconfig.json** file toggles them all simultaneously, but we can opt out of them indivisually

#### `noImplicitAny`

- TS, in some places, doesn't try to infer any type, instead it **falls back to `any`**. (Plain JS experience).
- Turning this on, will give error on any variable whose type is implicitly referred as `any`.

#### `strictNullChecks`

- By default `null` and `undefined` are **assignable** to any other type, but failure to handle this can cause countless bugs.
- Turning this on, makes handling `null` and `undefined` more explicit.

## Basic Types

### Primitives

- `string`
- `number` (general for `int` or `float` type)
- `boolean`

Use `typeOf` operator to refer to the type.

### Arrays

- `number[]` (or `Array<number>`)
- `string[]`
- Generic Type `T<U>`

### any

In case, we don't want a particular value to case typechecking errors.

### Type Annotations

On declaring a variable using `const`, `var`, or `let`, we can optionally add a type annotation to explicitly specify the type of the variable:

```ts
let myName: string = "Alice";
```

However, not needed as **TypeScript has automatic type inference**.

### Functions

#### Parameter type annotations

```ts
function greet(name: string) {
    console.log("Hello, " + name.toUpperCase() + "!!");
}
```

#### Return type annotations

Usually, not required because **return type is automatically inferred** based on `return` statements.

```ts
function getFavoriteNumber(): number {
    return 26;
}
```

### Anonymous Functions

```ts
const names = ["Alice", "Bob", "Eve"]
```

In the above code snippet, `names` have been inferred as `string[]`

#### Contextual Typing

```ts
names.forEach(function (name) {
    console.log(name.toUpperCase());
});
```

We can also re-write the same thing using arrow functions, as shown below:

```ts
names.forEach((name) => {
    console.log(name.toUpperCase());
});
```

Even though, the parameter `name` didn't have a type annotation, TypeScript used the types of the `forEach` function, along with the inferred type of the array to determine the type `name` will have.

This is called *contextual typing* because the *context* that the function occured within informs what type it should have.

### Object Types

To define an object type, simply list its properties and their types. For example, here's a function that takes a point-like object:

```ts
function printCoord(pt: { 
    x: number;  // can use either ',' or ';' as separator, if we don't specify the type, `any` is assumed.
    y: number
}) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}
```

To call the method:

```ts
printCoord({ x: 3, y: 7 });
```

### Optional Properties

These have `?` appended after their name. But if we access such a property that may not exist, we'll get the value `undefined` rather than runtime error. This is why we must add `undefined` check before using it.

```ts
function printName(obj: {
    first: string,
    last?: string   // optional property
}) {
    
    if(obj.last !== undefined) {
        // do something with obj.last
        console.log(obj.last.toUpperCase());
    }

    // A safe alternative with modern JavaScript syntax
    console.log(obj.last?.toUpperCase());
}
```

Another example:

```ts
type Foo: {
    bar?: number // default type: number | undefined
}
```

```ts
function addOne(foo: Foo): number {
    if (typeof foo.bar !== 'undefined') { // In this case, TS would have narrowed the type of bar to number.
        return foo.bar + 1;
    }
    throw new Error('bar is undefined');
}
```

Alternatively:

```ts
function addOne(foo: Foo): number {
    if(foo.bar) { // BEWARE! 0 is falsy.
        return foo.bar + 1;
    }
    throw new Error('bar is undefined');
}
```

Further Reading:
- [MDN: Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [optional-undefined-typescript](https://spin.atomicobject.com/2022/03/28/optional-undefined-typescript/)

### Union Types

- a union type is a type formed from two or more other types, representing values that may be any one of those types.
- referred to as union's members.

Here is a function that can operate on strings or numbers:

```ts
function printId(id: number | string) {
    console.log("Your ID is: " + id);
}
```

- TS will not allow any operation that is not valid for *every* member of the union.

#### Narrowing

##### Using `typeOf`

```ts
function printId(id: number | string) {
    if(typeof id === "string") {
        // In this branch, id is of type 'string'
        console.log(id.toUpperCase());
    } else {
        // Here, id is of type 'number'
        console.log(id);
    }
}
```

##### Using `Array.isArray()`

```ts
function welcomePeople(x: string[] | string) {
    if(Array.isArray(x)) {
        // Here: 'x' is 'string[]'
        console.log("Hello, " + x.join(" and "));
    } else {
        // Here: 'x' is 'string'
        console.log("Welcome lone traveler " + x);
    }
}
```

If every member in a union has a property in common, you can use that property without narrowing:

```ts
function getFirstThree(x: number[] | string) {
    // Both arrays and strings have a slice method
    return x.slice(0, 3);
}
```

### Type Aliases and Interfaces

Almost all the features of an *interface* are available in *type*.

**Key Difference**: A type cannot be re-opened to add new properties vs an interface which is always extendable.

### Type Assertions

Specifying the type of value, to be returned, that TypeScript may not have any idea.

Example: TS only knows that `document.getElementById` returns *some* kind of `HTMLElement`, but if we know that our page will always return an `HTMLCanvasElement` then apply type assertion

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Writing same thing using angle-bracket syntax:

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

**NOTE**:
Since, type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won't be an exception or `null` generated if the type assertion is wrong.

Example of invalid type assertion:

```ts
const x = "hello" as number;
```

*Too conservative rules* can be by-passed and asserted to `any` (or `unknown`) as follows:

```ts
const a = (expr as any) as T;
```

#### `const` keyword

Ref: [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

#### `as const` assertion

Ref: [What does as const keyword mean in TypeScript?](https://stackoverflow.com/questions/66993264/what-does-the-as-const-mean-in-typescript-and-what-is-its-use-case)

### Literal Types

Literal Types are themselves not helpful but when **combined with unions**, we can build a much more useful value.

#### Function accepting only a specific set of arguments

```ts
function printText(
    s: string, 
    alignment: "left" | "right" | "center") {
    
    // ...
}
```

```ts
printText("Hello", "left"); // OK!
printText("Hi", "centre"); // Wrong.
```

#### Function returning only a specific set of values

```ts
function compare(
    a: string, 
    b: string): -1 | 0 | 1 {
        return a === b ? 0 : a > b ? 1 : -1;
}
```

#### Literal Inference

**types** are used to **determine** both **reading** and **writing** behavior.

Consider the below code:

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = {
    url: "https://example.com",
    method: "GET"
};

// ERROR: Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'
handleRequest(req.url, req.method);
```

Two ways to work around this:

1. Change the inference by adding a type assertion in either location:

```ts
/*
 * Change 1
 *
 * It means, I intend for `req.method` to always have 
 * the literal type "GET" restricing any updates to 
 * req.method to have any other value.
 */
const req = { 
    url: "https://example.com", 
    method: "GET" as "GET"
}
```

```ts
/*
 * Change 2:
 *
 * It means, I know for other reasons that 
 * `req.method` is supposed to have the value "GET"
 */
handleRequest(req.url, req.method as "GET");
```

2. We can use `as const` to convert the entire object to be `type` literals

```ts
const req = {
    url: "https://example.com",
    method: "GET"
} as const;

handleRequest(req.url, req.method); // OK
```

**NOTE**:
The `as const` suffix acts like `const` but for the **type** system, **ensuring that all properties are assiged the literal type** instead of a more general version like `string` or `number`.

### `null` and `undefined`

In TS, the way these *types* behave depends whether we have the `strictNullChecks` option on.

#### `strictNullChecks` off

- This behavior is similar to other programming languages like Java, C#.
- The lack of checking for these values tends to be a major source of bugs thus we should always have this flag on.

#### `strictNullChecks` on

In this case, we need to add nullability check and check for `undefined` for any optional property and then proceed further. (Recall Narrowing)

#### Non-null Assertion Operator (Postfix `!`)

- Removing `null` and `undefined` from a *type* without doing any explicit checking.
- Writing `!` after any expression is effectively a type assertion that the value isn't `null` or `undefined`.

```ts
function liveDangerously(x?: number | null) {
    console.log(x!.toFixed()); // No error
}
```

**NOTE**:
Using this operator doesn't change the runtime behavior of your code, so it's important to only use `!` when we know that the value can't be `null` or `undefined`.

### Enums

Ref: [/docs/handbook/enums.html](https://www.typescriptlang.org/docs/handbook/enums.html)

Code snippet showing fundamental usage of enums

```ts
enum UserResponse {
    No = 0,
    Yes = 1
}

function respond(
    recipient: string,
    message: UserResponse
): void {
    // ...
}

respond("Tim Rogers", UserResponse.Yes);
```

Enums can also be mixed in computed and constant members but the only catch is that:
- either enums without initializers need to be first,
- or, have to come after numeric enums initialized with numeric constant or other constant enum members.

```ts
enum E {
    A = getSomeValue(),
    B   // Error, enum member must have initializer.
}
```

#### String Enums

Unlike `numeric` enums, `string` enums need to be initialized with a *string literal*.

- String enums do not have auto-incrementing behavior, but they *serialize* well.
- In debugging, string enums gives us more meaningful and readable value.

```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}
```

**NOTE**:
Refrain using *Heterogeneous Enums* i.e. it is meaningless to mix `numeric` and `string` enums.

#### Constant Enum Expression

A constant enum expression is a subset of `TypeScript` expressions that **can be fully evaluated at compile time**. A constant enum expression is the one which:

- A literal enum expression (basically a string literal or numeric literal)
- A reference to previously defined constant enum member (which can originate from different enum).
- A **paranthesized** constant enum expression.
- One of the `+`, `-`, `~` unary operators applied to constant enum expression.
- `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` binary operators with constant expression as operands.

**NOTE**:
We get **compile time error** for constant enum expressions to be evaluated to `NaN` or `Infinity`.

```ts
enum FileAccess {
    // constant members
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    // computed member
    G = "123".length,
}
```

#### Enum members as types

Enum members also become types as well! For example, we can say that certain members can *only* have the value of an enum member.

```ts
enum Shape {
    Circle,
    Square
}
```

```ts
interface Circle {
    kind: Shape.Circle;
    radius: number;
}
```

```ts
interface Square {
    kind: Shape.Square;
    sideLength: number;
}
```

```ts
let c: Circle = {
    kind: Shape.Square, // Error: Shape.Square cannot be assigned to type Shape.Circle
    radius: 100
};
```

#### Enum types as *union* of each member

With union enums:
- the type system is able to leverage the fact that it knows the exact set of values that exist in the enum itself.
- TS can catch bugs where we might be comparing values incorrectly.

```ts
enum E {
    Foo,
    Bar
}
```

```ts
function f(x: E) {
    if(x !== E.Foo || x !== E.Bar) { // Error, types have NO OVERLAP
    }
}
```

#### Enums at runtime (passed around to functions)

```ts
enum E {
    X,
    Y,
    Z
}
```

```ts
function f(obj: { X: number }) {
    return obj.X;
}
```

```ts
f(E); // works since 'E' has a property X.
```

#### Enums at compile time 

Use `keyof typeof` to get the *type* that represents all Enum keys as strings.

```ts
enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG
}
```

```ts
/**
 * This is equivalent to:
 * type logLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type logLevelStrings = keyOf typeOf LogLevel
```

```ts
function printImportant(key: logLevelStrings, message: string) {
    // get the integer assigned to this enum
    const num = LogLevel[key];

    if(num <= LogLevel.WARN) {
        // do somtething.
    }
}
```

#### Reverse mappings in `numeric` enums

In this case, `enum` is compiled into an object that stores both:

- forward mapping (`name` -> `value`)
- reverse mapping (`value` -> `name`)

```ts
enum Enum {
    A
}
```

```ts
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

#### `const` enums

They are useful to avoid generating extra code (when TS is converted to JS).

```ts
const enum Direction {
    Up,
    Down,
    Left,
    Right
}
```

```ts
let directions = [
    Direction.Up,
    Direction.Down,
    Direction.Left,
    Direction.Right
];
```

The generated JS code will now be:

```js
"use strict"
let directions = [
    0   /* Direction.Up */,
    1   /* Direction.Down */,
    2   /* Direction.Left */,
    3   /* Direction.Right */
];
```

#### Ambient Enums

*Describe* the shape of already existing enum types.

```ts
declare enum Enum {
    A = 1,
    B,
    C = 2
}
```

### Objects vs Enums

In modern TS, you may not need an enum when an object with `as const` could suffice:

```ts
const enum EDirection {
    Up,
    Down,
    Left,
    Right
}
```

```ts
const ODirection = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
} as const;
```

#### Using Enum as parameter

```ts
function walk(dirIndex: EDirection) {
    // ...
}
```

#### Using Object as parameter

```ts
type DirectionIndexes = typeOf ODirection[keyof typeof ODirection];

function run(dirIndex: DirectionIndexes) {
    // ...
} 
```

### Less Common Primitives

#### `BigInt` is used to handle very large integers

Creating bigint via `BigInt` function:

```ts
const oneHundred: bigint = BigInt(100);
```

Creating bigint via the literal syntax:

```ts
const anotherHundred: bigint = 100n; 
```

#### `Symbol` method to create a globally unique reference

```ts
const firstName = Symbol("name");
const secondName = Symbol("name");

if(firstName === secondName) { // No Overlap error
}
```

## Narrowing

Take a look at the below method:

```ts
function padLeft(padding: number | string, input: string): string {
    return input.repeat(padding);
}
```

We get compiler error at the invocation of `repeat` method because padding is type `number | string` and not number.

We'll now apply narrowing to tell the compiler know the exact type of padding:

```ts
function padLeft(padding: number | string, input: string): string {
    if(typeof padding === "number") // type-guard
        return input.repeat(padding);
    return padding + input;
}
```

### `typeof` type guards

In TypeScript checking against a value returned by a `typeof` is a type guard. Here is a list of values returned by `typeof`:

- "string"
- "number"
- "bigint"
- "boolean"
- "symbol"
- "undefined"
- "object"
- "function"

**NOTE**:
- `"arrays"` are essentially `"object"` types.
- `typeof` doesn't return `null`. 

In JavaScript, `typeof null` returns an `"object"`, due to this Bug, we get compiler errors in the case whenever a value is expected to be null.

```ts
function printAll(strs: string | string[] | null) {
    if(typeof strs === "object") {
        // Error! strs is possibly null
        for(const s of strs) {
            console.log(s);
        }
    }
    // ...
}
```

In order to handle such issues, we go for the next concept.

### Truthiness Narrowing

In JavaScript, `if` statements don't expect their conditionals to always have the type `boolean`. It uses the concept of "coerce"ing. Following expressions will "coerce" to `false`:

- `0`
- `NaN`
- `""` (the empty string)
- `0n` (the `bigint` version of zero)
- `null`
- `undefined`

Any other expression will "coerce" to `true`.

#### Coercing values to Boolean

- Using Boolean function: `Boolean("hello")`.
- Using double-negation (`!!`) operator: `!!"hello"`.

Both will return `true`.

Now, let us fix our `printAll` method:

```ts
function printAll(strs: string | string[] | null) {
    if(strs && typeof strs === "object") {
        for(const s of strs) {
            console.log(s);
        }
    }
    // ...
}
```

Using single-negation (`!`) operator, we can filter out any expected falsy values:

```ts
function multiplyAll(
    values: number[] | undefined,
    factor: number): number[] | undefined {
    if(!values)
        return values;
    return values.map(value => value * factor);
}
```

In the above code, if the variable `values` belongs to either `undefined` or `null`, it will simply return, thereby safeguarding us from getting errors at run-time.

### `in` operator narrowing

Determines if an object or its prototype chain has a property with the given name (or value). It automatically converts the given value to their corresponding types.


### `instanceof` type guard

Basically used to check if a given value is an "instance" of any type. Any value constructed with `new` keyword can be checked with `instanceof`.

### Assignments

The type of any value is governed based on the expression at the right-hand side. In the below code, the type of variable `x` will be `number | string`:

```ts
let x = Math.random() < 0.5 ? 10 : "Hello World";
```

**NOTE**:
The only value we can assign to variable `x` at any later point in the program is either of `number | string` and compiler error will arrive if some other type is assigned. This means the type at the time of declaration of the variable is deemed final.

### Control Flow Analysis

The analysis of code based on reachability is called Control Flow Analysis. This means that the exact type of any variable at any point in the program is governed with respect to the:

- value assignments
- type-guards

encountered in that flow.

### Using type predicates

Restricting the `type` a variable can have in a particular method.

To define a user-defined type-guard, we simply need to define a function whose return type is a *type predicate*. In the below code snippet, `animal is Fish` is our *type predicate*.

```ts
function isFish(animal: Fish | Bird): animal is Fish {
    return (animal as Fish).swim != undefined;
}
```

Any time, `isFish` will be called with some variable, TypeScript will *narrow* that variable to that specific type.

```ts
function doAction(animal : Fish | Bird) {
    if(isFish(animal)) {
        animal.swim();
    } else {
        animal.fly();
    }
}
```

**NOTE**:
Not only does TypeScript know that within the `if` block, animal is of type `Fish`. It also knows that within the else block, animal is not of type `Fish`, instead of type `Bird`.

Another useful application of type predicate is to filter out values of type `Fish` from a list of `Fish | Bird`:

```ts
const zoo: (Fish | Bird)[] = [fish, fish, bird, fish, bird, bird];
const fishes: Fish[] = zoo.filter(isFish);
```

### Discriminated Unions

Lets us write *type-safe* TypeScript code.

Each type (object) should have a common property that should help TypeScript to distinguish amongs the given types.

```ts
interface Circle {
    kind: "circle",
    radius: number
}
```

```ts
interface Square {
    kind: "square",
    length: number
}
```

```ts
type Shape = Circle | Square
```

Now, consider the below code snippet:

```ts
function getArea(shape: Shape) {
    // Error! radius does not exist on type 'Shape'
    return Math.PI * Math.pow(shape.radius, 2);
}
```

Since, `radius` is not a common property in the *union* type `Shape`. TypeScript thinks that shape might be a `Square` which does not have property `radius`. In order to solve this issue, we narrow down the type using the common property `kind`.

```ts
function getArea(shape: Shape) {
    switch(shape.kind) {
        case "circle":
            return Math.PI * Math.pow(shape.radius, 2);
        case "square":
            return Math.pow(shape.length, 2);
    }
}
```

### `never` type

Used to cut down the options of a union, when we know that we have exhausted all the possibilities.

## Functions

### Function type expressions

Functions in TypeScript are both functions (as in any programming language) and can be passed as an expression to a method argument.

```ts
function greeter(fn: (a: string) => void) {
    fn("Hello World");
}

function printToConsole(s: string) {
    console.log(s);
}

greeter(printToConsole);
```

We can also use *type aliasing* for a function type:

```ts
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
    // ...
}
```

### Call Signatures

In JavaScript, it is possible for functions to have properties as well. We can do so by writing a *call signature* in object type as shown:

```ts
type DescribableFunction = {
    description: string,
    (arg: number): boolean 
}
```

```ts
function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6));
}

function isGreaterThan3(arg: number): boolean {
    return arg > 3;
}

isGreaterThan3.description = "Is greater than 3";

doSomething(isGreaterThan3);
```

### Construct Signatures

Such methods will initialize the object using the `new` keyword and return the created object hence are called constructors.

### Generic Functions

In TypeScript, generics are used when we want to describe a correspondence between two values. We do this by declaring a *type parameter* in the function signature:

```ts
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}
```

In such a case, the type was *automatically inferred* by TypeScript.

We can also use multiple type parameters as well as shown:

```ts
function map<K, V>(arr: K[], fn: (n: K) => V): V[] {
    return arr.map(fn);
}
```

#### Constraints

Limitting the kinds of types that a Generic type parameter can accept. We can do so by using `extends` keyword:

```ts
function longestArray<T extends { length: number }>(a: T, b: T): T {
    if(a.length > b.length)
        return a;
    return b;
}
```

The above method restricts that the type of the variable can only be the one which has the property called `length`.

### Specifying type arguments

Suppose we have a method as shown below:

```ts
function combine<T>(a: T[], b: T[]): T[] {
    return a.concat(b);
}
```

The method will work fine if both arguments are of same type. If we want to pass different type arguments, then we can do as follows:

```ts
const arr = combine<number | string>([1,2,3], ["ab", "cd"]);
```

### Guidelines for writing Good Generic Functions

Having too many type parameters or using constraints where they aren’t needed can make inference less successful, frustrating callers of your function.

#### 1. Push type parameters down

When possible use the type parameter itself rather than constraining it.

#### 2. Always use as few type parameters as possible.

#### 3. Type parameters should always appear twice.

Type parameters are for relating the types of multiple values. If a type parameter is only used once in the function signature, it’s not relating anything. **Either as a parameter or as an inferred return type, but should be used twice**.

### Optional Parameters

Any parameter can be marked as optional using `?:` operator:

```ts
function fun(x?: number) {
    //
}
```

**NOTE**: 
Any unspecified (optional) parameters will by-default accept `undefined` (or `null`) as well.

This is why in the method `fun`, x is actually of type `number | undefined`.

#### Optional Parameters in Callbacks

> **Rule**: When writing a function type for a callback, never write an optional parameter unless you intend to call the function without passing that argument.

Optional parameters should always be avoided wherever possible.

### Function Overloads

In TypeScript, we can specify a function that can be called in different ways by writing *overload signatures*. To do this, write some number of function signatures (usually two or more), followed by the body of the function:

```ts
// Declarations
function makeDate(timestamp: number): Date;
function makeDate(day: number, month: number, year: number): Date;

// Definition
function makeDate(dayOrTimestamp: number, month?: number, year?: number): Date {
    if(month && year) {
        return new Date(dayOrTimestamp, month, year);
    } else {
        return new Date(dayOrTimestamp);
    }
}
```

```ts
const d1 = makeDate(Date.now());
const d2 = makeDate(13, 9, 2023);
// Error!
// Even though we wrote a function with 
// two optional parameters after the required one, 
// it can’t be called with two parameters!
const d3 = makeDate(Date.now(), 324324);
```

**NOTE**:
The signature of the *implementation* is not visible from the outside.

#### Rules for writing Good Overloads

##### 1. When writing an overloaded function, always have two or more overloads above the implementation of the function.

##### 2. The implementation signature should be compatible with the overload signatures. 

Following code snippets are all invalid:

```ts
function fn(x: boolean): void;
function fn(x: string): void;

// Argument Type Incompatibility error
function fn(x: boolean) {

}
```

```ts
function fn(x: string): string;
function fn(x: number): boolean;

// Return Type Incompatibility error
function fn(x: string | number) {
    return "oops";
}
```

##### 3. Always prefer parameters with union types instead of overloads whenever possible.

Consider the below method:

```ts
function len(s: string): number;
function len(arr: any[]): number;

function len(x: any) {
    return x.length;
}

len("") // OK
len([0]) // OK
len(Math.random() > 0.5 ? "hello" : [0]); // Error
```

The problem with this approach is that when `len` is called with either a `string` or `any[]`, the TypeScript understands the argument type. But if the argument type is not known at compile time, i.e. it might either be a `string` or an `array`, then TypeScript starts complaining. This is because **Typescript can only resolve a function call to a single overload**.

For such a scenario, union types are always preferred:

```ts
// Can now be invoked with either array or string type.
function len(x: len[] | string) {
    return x.length;
}
```

#### Declaring `this` in a Function

TypeScript automatically infers what `this` should be in a function via *Code Flow Analysis*. Consider the below code snippet:

```ts
const user = {
    id: 123,
    admin: false;

    becomeAdmin: function() {
        this.admin = true;
    }
}
```

In this case, TypeScript understands that the function `user.becomeAdmin` has a corresponding `this` which is the outer object `user`.

Sometime, we want to want more control over what object `this` represents. **TypeScript lets us declare the type for `this` in the function body.**

Additionally, we need to use `function` instead of arrow functions to achieve this behavior:

```ts
interface DB {
    // Declaring the type for this.
    filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();

// OK!
const admins = db.filterUsers(function (this: User)) {
    return this.admin;
}

// Arrow functions are not useful in this case
const admins = db.filterUser(() => this.admin);
```

### Other Types to know about

#### `void`

- In TypeScript, `void` is the inferred type when a function doesn't have any return statements.
- This will return `undefined` in JavaScript but `void` and `undefined` are **different** for TypeScript.

#### `object`

- Refers to any value that isn't a primitive. - Different from `{}` (empty object type).
- Different from `Object` (global type).
- In TypeScript, function types are considered to be `object`s.

#### `unknown`

Similar to but safer than `any`.

#### `never`

- Represents values which are *never* observed.
- If used as a method's return type, would mean that the function throws an exception.
- It also appears when TypeScript infers that all expected `union` types are now exhausted. (if-else / switch case).

#### `Function`

Generally best avoided.

### Rest Parameters and Arguments

#### Rest Parameters

A function can accept an *unbounded* number of arguments. This is done using Rest parameters as shown:

```ts
function multiply(n: number, ...m: number[]): number[] {
    return m.map((x) => n * x);
}
```

A Rest Parameter should always be of array type: `Array<T>` or `T[]`.

#### Rest Arguments

We can provide a variable number of arguments from an *iterable* object. Since, the `push` method of array can take unbounded arguments, we can do:

```ts
const arr1 = [1,2,3];
const arr2 = [4,5];
arr1.push(...arr2);
```

However, if a method does not accept a Rest Parameter, then we need to apply `as const` suffix to our declared variable to convert it into a `tuple`.

```ts
// Inferred as a 2-length tuple.
const args = [3,5] as const;
const angle = Math.atan2(...args);
```

**NOTE**:
The tuple (`Array<T>`) is this case, should have exactly the same number of values as expected in the called method.

### Parameter Destructuring

Conveniently unpack objects provided as an argument into one or more local objects in the function body. The type annotation for the object goes after the destructuring syntax:

```ts
function sum({a, b, c}: {a: number, b: number, c: number}) {
    console.log(a + b + c);
}
```

We can also have a named type here as well:

```ts
type ABC = {a: number, b: number, c: number};
function sum({a, b, c}: ABC) {
    console.log(a + b + c);
}
```

### Unusual behavior with `void` 

> A void-returning callback type says "I'm not going to look at your return value, if one exists".

Ref: [why-are-functions-returning-non-void-assignable-to-functions-returning-void](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)

*Contextual typing* with a return type of void **does not force** functions to not return something. Another way to say this is a contextual function type with a `void` return type (`type voidFunc = () => void`), when implemented, **can return any other value, but it will be ignored**.

```ts
type voidFunction = () => void;
```

This contextual function can be implemented in any of the below ways and all of them are valid.

```ts
const f1: voidFunction = () => {
    return true;
};

const f2: voidFunction = () => true;

const f3: voidFunction = function() {
    return true;
};
```

Moreover, all of the variables `f1`, `f2`, `f3` will have the return type of `void`.

This behaviour exists to support situations like these:

```ts
const src = [1,2,3];
const des = [0];

src.forEach((item) => des.push(item));
```

Here, `push` method returns a `number` type while `forEach` method expects a function of return type `void`. But, the code works fine.

Additionally, if a literal function definition has a `void` return type, then it must not return anything.

```ts
function f4(): void {
    // Error!
    return true;
}
```

## Other

- [GitHub: TypeScript FAQ by Microsoft](https://github.com/Microsoft/TypeScript/wiki/FAQ)
