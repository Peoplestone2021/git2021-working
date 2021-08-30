// interface: 객체 구조의 형식
// interface 타입명 {
//   속성명: 타입;
//   속성명: 타입;
// }
interface User {
  firstname: string;
  lastname?: string; // 속성명?, optional(필수값이 아닌) 속성
  phone?: string;
}

function printName(obj: User) {
  Object.keys(obj).forEach((key) => {
    console.log("key " + key);
  });
  for (let prop in obj) {
    console.log("prop " + prop);
  }
  console.log(obj.firstname + "" + obj.lastname);
}

// function printName(obj: User) {
//   console.log(obj.firstname + " " + obj.lastname);
// }

// 타입명[]
// number[], string[], User[]
function printNames(arr: User[]) {
  for (let obj of arr) {
    console.log(obj.firstname + " " + obj.lastname);
  }
}

const user: User = {
  firstname: "John",
  // lastname: "Smith",
};

// user.phone = 01011111111;

const users: User[] = [
  { firstname: "John", lastname: "Smith" },
  { firstname: "Gildong", lastname: "Hong" },
];

printName(user);
printNames(users);
