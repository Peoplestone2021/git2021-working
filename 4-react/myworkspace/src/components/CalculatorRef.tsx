// Calculator 컴포넌트

import { useState, useRef } from "react";

// 1. 버튼을 클릭하면 prompt로 입력값을 두번 받음
// a = prompt, b = prompt

// 2. 그다음에 연산자를 prompt로 받음
// +, -, *, /

// 3. 입력값 두개에 대한 연산 결과를 화면 출력
// state를 사용해야함

// 예) 입력값1: 10
//     입력값2: 5
//     연산자: *
//     결과값: 50
//     <div>50</div>

const Calculator = () => {
  const [result, setResult] = useState(0);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRefOp = useRef<HTMLInputElement>(null);

  const calculate = () => {
    const a = inputRef1.current?.value;
    const b = inputRef2.current?.value;
    const op = inputRefOp.current?.value;

    console.log(`${a}${op}${b}`);

    // eval(문자열)
    // 문자열이 자바스크립트코드로 실행할 수 있으면 실행
    // const code = `alert(${a}${op}${b})`;
    // eval(code);
    // eslint-disable-next-line
    setResult(eval(`${a}${op}${b}`));

    // state 값에 변동이 없으면 컴포넌트를 업데이트하지 않음
    // 기존 result == 20
    // 변동 result == 20, 컴포넌트를 업데이트하지 않음
  };

  return (
    <div>
      <h2>Calculator</h2>
      {/* 입력박스 3개, 첫번째숫자/두번째숫자/연산자 */}
      <input ref={inputRef1} placeholder="첫번째숫자"></input>
      <input ref={inputRef2} placeholder="두번째숫자"></input>
      <input ref={inputRefOp} placeholder="연산자 (+, -, *, /"></input>
      <button
        onClick={() => {
          calculate();
        }}
      >
        Start
      </button>
      <div>{result}</div>
    </div>
  );
};

export default Calculator;
