/*underscore NPM*/

//underscore 모듈을 가지고옴.
//규칙이랄까 변수명을 _로 씀
var _ = require('underscore');
var arr=[3,6,9,1,12];
//_.first(arr) : arr의 첫번쨰 원소
//_.last(arr) : arr의 마지막 원소
console.log(_.first(arr));
console.log(_.last(arr));
