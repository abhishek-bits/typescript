function printName(
    firstName: string,
    lastName?: string
) {
    if(lastName !== undefined) {
        console.log(`"Name: ${firstName.toString()} ${lastName.toString()}"`);
    }
    /*
     * Modern JavaScript syntax
     */
    if(lastName) { // BEWARE! 0 is Falsy
        console.log(`"Name: ${firstName.toString()} ${lastName?.toString()}"`);
    }
    /*
     * Recommended Way
     */
    if(typeof lastName !== 'undefined') {
        console.log(`"Name: ${firstName.toString()} ${lastName?.toString()}"`);
    }
}

printName("Abhishek");
printName("Abhishek", "Sharma");


