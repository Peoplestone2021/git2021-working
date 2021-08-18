// generic: 제너릭
// 타입 매개변수
// 다양한 타입에 따라서 실행처리를 다르게 하기 위함
function identity<Type>(arg: Type): Type {
  // 타입에 따라 내부코드 분기
  // 예) number면 덧셈
  // 예) string이면 문자열을 구분자로 결합
  return arg;
}

let output1 = identity<string>("Typescript");
let output2 = identity<number>(1);
