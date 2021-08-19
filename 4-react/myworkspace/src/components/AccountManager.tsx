import { useState } from "react";
import { sortAndDeduplicateDiagnostics } from "typescript";

// 계좌관리

// 입력박스, 버튼 두 개
// 입력박스에는 입출금 금액 넣음.
// 버튼: 입금버튼, 출금버튼

const ListItem = ({ key, history }: { key: number; history: number }) => {
  const color = history < 0 ? "blue" : "red";
  return (
    <li key={key} style={{ color: color }}>
      {history}
    </li>
  );
};

const AccountManager = () => {
  const [history, setHistory] = useState([]);
  const deposit = () => {
    const dep = parseInt(prompt("입금하실 금액을 입력해주세요.", 10));

    setHistory([dep, ...history]);
  };
  const withdraw = () => {
    prompt("출금하실 금액을 입력해주세요.");
    return -prompt;
  };

  const sum = () => {
    const bal = `${deposit}` + `${withdraw}`;
  };
  const [balance, bal] = useState(0);

  return (
    <div>
      <button
        onClick={() => {
          deposit();
        }}
      >
        입금하기
      </button>
      <button
        onClick={() => {
          withdraw();
        }}
      >
        출금하기
      </button>
      <div>잔액: {balance}</div>
      <div>
        <ul>
          {history.map((num, index) => (
            <ListItem key={index} history={num} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountManager;
