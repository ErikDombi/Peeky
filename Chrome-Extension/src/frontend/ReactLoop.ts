type MapFunction = (value: number) => any;
let forLoop = (i: number, func: MapFunction) => [...Array(i).keys()].map(func);

export {forLoop};