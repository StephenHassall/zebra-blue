'use strict';

var w = require('./nodeClass.js');
var Test = w.Test;
var Test2 = w.Test2;

var a = new Test('hello');
var b = new Test2('world');

console.log(a.name);
console.log(b.name);

