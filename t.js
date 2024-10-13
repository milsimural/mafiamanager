const os = require('os');
const res = os.platform();
console.log(res);

const my_math = require('./my_math');
const res1 = my_math.add(4, 5);
console.log(res1);
