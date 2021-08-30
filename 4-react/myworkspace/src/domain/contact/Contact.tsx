import { useState, useRef } from "react";
import produce from "immer";

interface ContactState {
  id: number;
  name: string | undefined;
  phoneNumber: string | undefined;
  eMail: string | undefined;
  isEdit?: boolean;
}

const Contact = () => {
  const [contactList, setContactList] = useState<ContactState[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const numRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const tbRef = useRef<HTMLTableSectionElement>(null);

  console.log("1" + tbRef);
  // if (!tbRef) return;

  let tnum = 0;
  const add = () => {
    const contact: ContactState = {
      id: contactList.length > 0 ? contactList[0].id + 1 : 1,
      name: nameRef.current?.value,
      phoneNumber: numRef.current?.value,
      eMail: mailRef.current?.value,
    };
    setContactList(
      produce((state) => {
        state.unshift(contact);
      })
    );
    tnum = tnum + 1;
  };

  const edit = (id: number, mod: boolean) => {
    setContactList(
      produce((state) => {
        const item = state.find((item) => item.id === id);
        if (item) {
          item.isEdit = mod;
        }
      })
    );
  };

  const save = (id: number, index: number) => {
    console.log(tbRef.current);

    // ul 밑에 있는 입력박스중에서 index번째 입력박스만 선택
    const inputName = tbRef.current?.querySelectorAll("name")[index];
    const inputPhoneNumber =
      tbRef.current?.querySelectorAll("phone-number")[index];
    const inputEmail = tbRef.current?.querySelectorAll("input")[index];
    console.log("console.inputName" + inputName);
    setContactList(
      produce((state) => {
        const item = state.find((item) => item.id === id);
        if (item) {
          // item.name = inputName?.value;
          // item.phoneNumber = inputPhoneNumber?.value;
          item.eMail = inputEmail?.value;
          item.isEdit = false;
        }
      })
    );
  };
  const del = (id: number, index: number) => {
    setContactList(
      produce((state) => {
        state.splice(index, 1);
      })
    );
  };

  return (
    <body style={{ width: "700px" }} className="mx-auto">
      <h2 className="text-center my-5">연락처 관리</h2>
      <form
        id="form-input"
        className="d-flex"
        //onSubmit={{"return false"}}
      >
        <input
          id="input-name"
          type="txt"
          className="form-control me-2"
          placeholder="이름"
          style={{ width: "20%" }}
          ref={nameRef}
        />
        <input
          id="input-phone-num"
          type="txt"
          className="form-control me-2"
          placeholder="전화번호"
          style={{ width: "30%" }}
          ref={numRef}
        />
        <input
          id="input-e-mail"
          type="txt"
          className="form-control me-2"
          placeholder="e메일"
          style={{ width: "50%" }}
          ref={mailRef}
        />
        <button
          id="btn-add"
          type="button"
          className="btn btn-primary text-nowrap"
          onClick={() => {
            add();
          }}
        >
          추가
        </button>
      </form>
      <table className="table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">이름</th>
            <th scope="col">전화번호</th>
            <th scope="col">e-메일</th>
            <th scope="col" className="text-center" style={{ width: "10%" }}>
              수정
            </th>
          </tr>
        </thead>
        {contactList.map((item, index) => (
          <tbody id="tr-list" ref={tbRef}>
            {!item.isEdit && (
              <tr>
                <td scope="col">{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.eMail}</td>
                <div className="d-flex">
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2 me-1 text-nowrap"
                    onClick={() => {
                      edit(item.id, true);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm text-nowrap"
                    onClick={() => {
                      del(item.id, index);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </tr>
            )}
            {item.isEdit && (
              <tr>
                <td scope="col">{item.id}</td>
                <input
                  id="name"
                  type="text"
                  className="d-flex w-30%"
                  defaultValue={item.name}
                />

                <input
                  id="phone-number"
                  type="text"
                  className="d-flex w-30%"
                  defaultValue={item.phoneNumber}
                />

                <input
                  id="email"
                  type="text"
                  className="d-flex w-30%"
                  defaultValue={item.eMail}
                />
                <div className="d-flex">
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2 me-1 text-nowrap"
                    onClick={() => {
                      save(item.id, index);
                    }}
                  >
                    저장
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm text-nowrap"
                    onClick={() => {
                      del(item.id, index);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </tr>
            )}
          </tbody>
        ))}
        <tfoot id="tfoot">
          {contactList.length === 0 && (
            <tr id="empty">
              <td colSpan={5} className="text-center">
                데이터를 입력해 주세요.
              </td>
            </tr>
          )}
        </tfoot>
      </table>
    </body>
  );
};

export default Contact;
