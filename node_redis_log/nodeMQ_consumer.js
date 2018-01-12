var nodeMQ = require("./nodeMQ");

console.time("consumer")
nodeMQ.consumer("listKey")
console.timeEnd("consumer")