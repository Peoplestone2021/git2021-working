import { useState } from "react";

//화면에 뭔가 변경을 일으켜야 함 -> 내부에서 처리 state, 외부에서 온다 prop

const Counter = () => {
  // state 변경함수로 state를 변경했을 때만 컴포넌트를 업데이트함
  // 실제로는 변동사항이 있는 부분만 다시 그림
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Counter</h2>
      <div>
        <button
          onClick={() => {
            alert("클릭");
          }}
        >
          COUNT
        </button>
        <span>1</span>
      </div>
    </div>
  );
};

export default Counter;
