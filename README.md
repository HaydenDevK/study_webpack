# study_webpack

## 학습 목차

### [1. 기본 개념](#기본-개념)

### [2. Webpack 예제](#Webpack-예제)

## 기본 개념

#### 모듈(Module) : 재사용 가능한 코드조각

#### 번들링(Bundling) : JS, CSS, 이미지 등의 파일을 묶어주는 작업

#### 모듈 번들러(Module Bundler) : 여러 개의 파일들을 하나의 파일로 묶어주는 라이브러리 (ex. **Webpack**)

## Webpack 예제

#### 1. package.json 생성
```
npm init -y
```

#### 2. Webpack, Webpack cli 설치
```
npm install webpack webpack-cli --save-dev // 개발단계에서만
```

#### 3. 번들링 할 대상 예제 파일 (.src/app.js) 생성
```jsx
const components = () => {
  const h1 = document.createElement('h1');
  h1.innerText = 'hello webpack!';
  return h1;
};
document.body.appendChild(components()); // h1을 body에 append
```

#### 4. webpack.config.js 설정
```jsx
const path = require('path'); // require는 node.js의 코어 라이브러리 중 하나로 경로를 사용할 수 있게한다.
module.exports = {
  mode: 'production', // 웹팩 빌드 옵션 (개발용인지 배포용인지 구분)
  entry: './src/app.js', // 번들링 할 대상 파일의 상대 경로
  output: {
    // 번들링 완료 파일 생성 시 이름, 파일 경로
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // node.js의 메서드로 프로젝트 기본 경로와, 경로로 지정할 폴더 이름을 지정해서 경로를 생성
  }
};
// 참고 : webpack.config.js는 웹팩 명령을 실행하면 자동으로 참고되어 사용된다.
// 주의 : `;` 빼먹으면 실행 오류난다.
```

#### 5. webpack 실행
```
npx webpack
```
```
asset bundle.js 112 bytes [emitted] [minimized] (name: main)
./src/app.js 190 bytes [built] [code generated]
webpack 5.70.0 compiled successfully in 211 ms
```

#### 6. bundle.js 확인
```jsx
document.body.appendChild(
  (() => {
    const e = document.createElement('h1');
    return (e.innerText = 'hello webpack!'), e;
  })()
);
```

#### 7. babel 설치
```
npm install babel-loader @babel/core @babel/preset-env --save-dev
// babel-loader : webpack과 babel을 연동
// @babel/core : babel의 핵심 기능
// @babel/preset-env : 필수적인 plugin을 모아놓은 가장 많이 사용하는 preset
// --save-dev 혹은 -D로 설치 시 : devDependencies(개발 단계 의존성)에 추가된다. 왜냐하면, 배포 후에는 개발 중에만 필요하고, 서비스 실행에는 필요없으니까!
```

#### 8. babel.config.js 설정
```jsx
module.exports = (api) => {
  api.cache(true);
  const presets = [
    // babel이 구버전 코드로 변환할 때 참고할 셋팅 값
    ['@babel/preset-env']
  ];
  return {
    presets
  };
  // 주의 : return은 객체 형태로 작성
  // return presets; 등 객체 외 형태로 작성 시 에러난다.
  // Error: babel.config.js: Configuration should be an exported JavaScript object.
};
```

#### 9. webpack.config.js에 babel 설정 추가
```jsx
module: {
  // 모듈들(js, image, css, 등)을 처리하는 방식 정의
  rules: [
    // 규칙
    {
      test: /\.js$/, // 처리할 모듈의 파일 형식을 정규표현식으로 (= 자바스크립트 파일이 있다면)
      use: ['babel-loader'], // 해당 모듈에 사용할 loader (= babel-loader를 사용해라)
      excludes: /node_modules/ // 제외할 경로 (= 단, node_modules 파일에 있는 자바스크립트 파일은 제외해라)
    }
  ];
}
```

#### 10. bundle.js 문법 변화 확인
```jsx
(()=>{var e;document.body.appendChild(((e=document.createElement("h1")).innerText="hello webpack!",e))})();
```

#### 11. app.js에서 다른 js 파일 가져다 쓰는 방법
```jsx
// file exports (다른 js 파일을 불러와서 쓰기)
const monkey = require('./monkey.js'); // 변수에 담아쓰면 된다. require 말고 import 방식으로도 가능하다.
console.log(monkey);
```

#### 12. bundle.js 내용 추가 확인
```jsx
(()=>{var e,o,n={233:e=>{e.exports={name:"monkey",food:["banana","apple"]}}},r={};function t(e){var o=r[e];if(void 0!==o)return o.exports;var a=r[e]={exports:{}};return n[e](a,a.exports,t),a.exports}o=t(233),console.log(o),document.body.appendChild(((e=document.createElement("h1")).innerText="hello webpack!",e))})();
```

#### 13. 정상 실행 확인 (index.html에 번들링 결과물인 bundle.js를 링크 -> VSC Go live로 실행)
```html
<body>
  <script src="dist/bundle.js"></script>
</body>
```

#### 14. 번들링 자동화 설정
```
npx webpack --watch
// 파일에 변화가 있을 시 (ctrl+S로 저장하는 순간) 실시간 번들링
// 중지 방법 : ctrl+C
```

#### 15. css 번들링 설정
```
npm install css-loader style-loader --save-dev
```
```css
/* 샘플 css 작성 */
h1 {
  color: white;
  background: red;
}
```
```jsx
/* app.js에서 css 파일 가져다 쓰는 방법 */
require('./css/main.css');
```
```jsx
/* webpack.config.js에 css 설정 추가 */
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```
```
npx webpack
```
```jsx
/* bundle.js 내용 추가 확인 */
(()=>{var e,t,r={233:e=>{e.exports={name:"monkey",food:["banana","apple"]}},556:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var n=r(81),o=r.n(n),a=r(645),s=r.n(a)()(o());s.push([e.id,"h1 {\n  background: red;\n  color: white;\n}\n",""]);const i=s},645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var r="",n=void 0!==t[5];return t[4]&&(r+="@supports (".concat(t[4],") {")),t[2]&&(r+="@media ".concat(t[2]," {")),n&&(r+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),r+=e(t),n&&(r+="}"),t[2]&&(r+="}"),t[4]&&(r+="}"),r})).join("")},t.i=function(e,r,n,o,a){"string"==typeof e&&(e=[[null,e,void 0]]);var s={};if(n)for(var i=0;i<this.length;i++){var c=this[i][0];null!=c&&(s[c]=!0)}for(var u=0;u<e.length;u++){var l=[].concat(e[u]);n&&s[l[0]]||(void 0!==a&&(void 0===l[5]||(l[1]="@layer".concat(l[5].length>0?" ".concat(l[5]):""," {").concat(l[1],"}")),l[5]=a),r&&(l[2]?(l[1]="@media ".concat(l[2]," {").concat(l[1],"}"),l[2]=r):l[2]=r),o&&(l[4]?(l[1]="@supports (".concat(l[4],") {").concat(l[1],"}"),l[4]=o):l[4]="".concat(o)),t.push(l))}},t}},81:e=>{"use strict";e.exports=function(e){return e[1]}},118:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>y});var n=r(379),o=r.n(n),a=r(795),s=r.n(a),i=r(569),c=r.n(i),u=r(565),l=r.n(u),d=r(216),p=r.n(d),f=r(589),v=r.n(f),m=r(556),h={};h.styleTagTransform=v(),h.setAttributes=l(),h.insert=c().bind(null,"head"),h.domAPI=s(),h.insertStyleElement=p(),o()(m.Z,h);const y=m.Z&&m.Z.locals?m.Z.locals:void 0},379:e=>{"use strict";var t=[];function r(e){for(var r=-1,n=0;n<t.length;n++)if(t[n].identifier===e){r=n;break}return r}function n(e,n){for(var a={},s=[],i=0;i<e.length;i++){var c=e[i],u=n.base?c[0]+n.base:c[0],l=a[u]||0,d="".concat(u," ").concat(l);a[u]=l+1;var p=r(d),f={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==p)t[p].references++,t[p].updater(f);else{var v=o(f,n);n.byIndex=i,t.splice(i,0,{identifier:d,updater:v,references:1})}s.push(d)}return s}function o(e,t){var r=t.domAPI(t);return r.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;r.update(e=t)}else r.remove()}}e.exports=function(e,o){var a=n(e=e||[],o=o||{});return function(e){e=e||[];for(var s=0;s<a.length;s++){var i=r(a[s]);t[i].references--}for(var c=n(e,o),u=0;u<a.length;u++){var l=r(a[u]);0===t[l].references&&(t[l].updater(),t.splice(l,1))}a=c}}},569:e=>{"use strict";var t={};e.exports=function(e,r){var n=function(e){if(void 0===t[e]){var r=document.querySelector(e);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(e){r=null}t[e]=r}return t[e]}(e);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");n.appendChild(r)}},216:e=>{"use strict";e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},565:(e,t,r)=>{"use strict";e.exports=function(e){var t=r.nc;t&&e.setAttribute("nonce",t)}},795:e=>{"use strict";e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(r){!function(e,t,r){var n="";r.supports&&(n+="@supports (".concat(r.supports,") {")),r.media&&(n+="@media ".concat(r.media," {"));var o=void 0!==r.layer;o&&(n+="@layer".concat(r.layer.length>0?" ".concat(r.layer):""," {")),n+=r.css,o&&(n+="}"),r.media&&(n+="}"),r.supports&&(n+="}");var a=r.sourceMap;a&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),t.styleTagTransform(n,e,t.options)}(t,e,r)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{"use strict";e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},n={};function o(e){var t=n[e];if(void 0!==t)return t.exports;var a=n[e]={id:e,exports:{}};return r[e](a,a.exports,o),a.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t=o(233),console.log(t),o(118),document.body.appendChild(((e=document.createElement("h1")).innerText="hello webpack!",e))})();
```
```
VSC Go Live로 CSS 적용 확인
```
