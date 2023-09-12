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
