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

### Narrowing

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

#### `typeof` type guards

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

#### Truthiness Narrowing

In JavaScript, `if` statements don't expect their conditionals to always have the type `boolean`. It uses the concept of "coerce"ing. Following expressions will "coerce" to `false`:

- `0`
- `NaN`
- `""` (the empty string)
- `0n` (the `bigint` version of zero)
- `null`
- `undefined`

Any other expression will "coerce" to `true`.

##### Coercing values to Boolean

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

#### `in` operator narrowing

Determines if an object or its prototype chain has a property with the given name (or value). It automatically converts the given value to their corresponding types.


