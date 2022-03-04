// JS file import (다른 js 파일을 불러와서 쓰기)
const monkey = require('./monkey.js'); // 변수에 담아쓰면 된다. require 말고 import 방식으로도 가능하다.
console.log(monkey);

// CSS file import
require('./css/main.css'); // webpack 설정까지하면, 번들링 시 불러와짐

// sample code
const components = () => {
  const h1 = document.createElement('h1');
  h1.innerText = 'hello webpack!';
  return h1;
};

document.body.appendChild(components());
