# STUDY_Webpack

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
(() => {
  var e;
  document.body.appendChild(
    (((e = document.createElement('h1')).innerText = 'hello webpack!'), e)
  );
})();
```

#### 11. app.js에서 다른 js 파일 가져다 쓰는 방법

```jsx
// file exports (다른 js 파일을 불러와서 쓰기)
const monkey = require('./monkey.js'); // 변수에 담아쓰면 된다. require 말고 import 방식으로도 가능하다.
console.log(monkey);
```

#### 12. bundle.js 내용 추가 확인

```jsx
(() => {
  var e,
    o,
    n = {
      233: (e) => {
        e.exports = { name: 'monkey', food: ['banana', 'apple'] };
      }
    },
    r = {};
  function t(e) {
    var o = r[e];
    if (void 0 !== o) return o.exports;
    var a = (r[e] = { exports: {} });
    return n[e](a, a.exports, t), a.exports;
  }
  (o = t(233)),
    console.log(o),
    document.body.appendChild(
      (((e = document.createElement('h1')).innerText = 'hello webpack!'), e)
    );
})();
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

#### 15. css

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

```
VSC Go Live로 CSS 적용 확인
```
