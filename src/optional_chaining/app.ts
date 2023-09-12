type Foo = {
    bar?: Bar
}

type Bar = {
    fooBar?: FooBar
}

type FooBar = {
    item?: number
}

function printItem(obj: Foo) : void {
    if(obj.bar) {
        console.log("Foo[Bar]");
    }
    if(obj.bar?.fooBar) {
        console.log("Foo[Bar[FooBar]]");
    }
    if(obj.bar?.fooBar?.item) {
        console.log("Foo[Bar[FooBar[item]]]");
    }
    if(obj.bar?.fooBar?.item) {
        console.log(obj.bar.fooBar.item);
        return;
    }
    console.log("NaN");
}

// let fooObj: Foo = {}
// printItem(fooObj);
printItem({});

// let barObj: Bar = {}
// let fooObj = {
//     bar: barObj
// }
// printItem(fooObj);
printItem({ bar: {} });

// let fooBarObj: FooBar = {}
// let barObj = {
//     fooBar: fooBarObj
// }
// let fooObj = {
//     bar: barObj
// }
// printItem(fooObj);
printItem({bar: {fooBar: {}}});

// let fooBarObj = {
//     item: 10
// }
// let barObj = {
//     fooBar: fooBarObj
// }
// let fooObj = {
//     bar: barObj
// }
// printItem(fooObj);
printItem({bar: {fooBar: {item: 10}}});
