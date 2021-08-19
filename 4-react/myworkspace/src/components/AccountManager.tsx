import { useState } from "react";

// 계좌관리

// 입력박스, 버튼 두 개
// 입력박스에는 입출금 금액 넣음.
// 버튼: 입금버튼, 출금버튼

const AccountManager = () => {
  return (
    <div>
      <button
        onClick={() => {
          prompt("금액을 입력해주세요.", "");
        }}
      >
        입금하기
      </button>
      <button
        onClick={() => {
          prompt("금액을 입력해주세요.", "");
        }}
      >
        출금하기
      </button>
      <div>잔액</div>
      <div>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default AccountManager;
