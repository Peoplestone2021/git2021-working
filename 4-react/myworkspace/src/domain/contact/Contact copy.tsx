import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import produce from "immer";

interface ContactState {
  id: number;
  name: string | undefined;
  phoneNumber: string | undefined;
  eMail: string | undefined;
  createdTime: number;
  isEdit?: boolean;
}

const getTimeString = (unixtime: number) => {
  const dateTime = new Date(unixtime);
  const day = 24 * 60 * 60 * 1000;
  return unixtime - new Date().getTime() >= day
    ? dateTime.toLocaleDateString()
    : dateTime.toLocaleTimeString();
  // return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
};

const Contact = () => {
  const contact = useSelector((state: RootState) => state.contact);
  const history = useHistory();

  const [contactList, setContactList] = useState<ContactState[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const numRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const tbRef = useRef<HTMLTableSectionElement>(null);
  const trRef = useRef<HTMLTableRowElement>(null);

  console.log("1" + tbRef);
  // if (!tbRef) return;

  let tnum = 0;
  const add = () => {
    const contact: ContactState = {
      id: contactList.length > 0 ? contactList[0].id + 1 : 1,
      name: nameRef.current?.value,
      phoneNumber: numRef.current?.value,
      eMail: mailRef.current?.value,
      createdTime: new Date().getTime(),
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

    const inputName = tbRef.current
      ?.querySelectorAll("td")
      [index].querySelector("name");
    const inputPhoneNumber = tbRef.current
      ?.querySelectorAll("td")
      [index].querySelector("num");
    const inputEmail = tbRef.current
      ?.querySelectorAll("td")
      [index].querySelector("mail");
    console.log("console.inputName" + inputName);
    console.log("console.inputPhoneNumber" + inputPhoneNumber);
    console.log("console.inputEmail" + inputEmail);

    if (!inputName) return;
    if (!inputPhoneNumber) return;
    if (!inputEmail) return;

    setContactList(
      produce((state) => {
        const item = state.find((item) => item.id === id);
        if (item) {
          item.name = inputName.toString();
          item.phoneNumber = inputPhoneNumber.toString();
          item.eMail = inputEmail.toString();
          item.isEdit = false;
        }
      })
    );
  };
  // const del = (id: number, index: number) => {
  //   setContactList(
  //     produce((state) => {
  //       state.splice(index, 1);
  //     })
  //   );
  // };

  return (
    <body style={{ width: "40vw" }} className="mx-auto">
      <h2 className="text-center my-5">연락처 관리</h2>
      <form
        id="form-input"
        className="d-flex w-100"
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
      <table className="table-striped w-100">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">이름</th>
            <th scope="col">전화번호</th>
            <th scope="col">e-메일</th>
            {/* <th scope="col" className="text-center" style={{ width: "10%" }}>
              수정
            </th> */}
          </tr>
        </thead>
        {contactList.map((item, index) => (
          <tbody id="tr-list" ref={tbRef}>
            <tr
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push(`/contacts/${item.id}`);
              }}
            >
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.phoneNumber}</td>
              <td>{item.eMail}</td>
            </tr>
          </tbody>
          // <tbody id="tr-list" ref={tbRef}>
          //   {!item.isEdit && (
          //     <tr>
          //       <td>{item.id}</td>
          //       <td>{item.name}</td>
          //       <td>{item.phoneNumber}</td>
          //       <td>{item.eMail}</td>
          //       <div className="d-flex">
          //         <button
          //           className="btn btn-outline-secondary btn-sm ms-2 me-1 text-nowrap"
          //           onClick={() => {
          //             edit(item.id, true);
          //           }}
          //         >
          //           수정
          //         </button>
          //         <button
          //           className="btn btn-outline-secondary btn-sm text-nowrap"
          //           onClick={() => {
          //             del(item.id, index);
          //           }}
          //         >
          //           삭제
          //         </button>
          //       </div>
          //     </tr>
          //   )}
          //   {item.isEdit && (
          //     <tr ref={trRef}>
          //       <td>{item.id}</td>
          //       <td>
          //         <input
          //           id="name"
          //           type="text"
          //           className="d-flex w-30%"
          //           defaultValue={item.name}
          //         />
          //       </td>
          //       <td>
          //         <input
          //           id="phone-number"
          //           type="text"
          //           className="d-flex w-30%"
          //           defaultValue={item.phoneNumber}
          //         />
          //       </td>
          //       <td>
          //         <input
          //           id="email"
          //           type="text"
          //           className="d-flex w-30%"
          //           defaultValue={item.eMail}
          //         />
          //       </td>
          //       <td>
          //         <input
          //           id="email"
          //           type="text"
          //           className="d-flex w-30%"
          //           defaultValue={item.createdTime}
          //         />
          //       </td>
          //       <div className="d-flex">
          //         <button
          //           className="btn btn-outline-secondary btn-sm ms-2 me-1 text-nowrap"
          //           onClick={() => {
          //             save(item.id, index);
          //           }}
          //         >
          //           저장
          //         </button>
          //         <button
          //           className="btn btn-outline-secondary btn-sm text-nowrap"
          //           onClick={() => {
          //             del(item.id, index);
          //           }}
          //         >
          //           삭제
          //         </button>
          //       </div>
          //     </tr>
          //   )}
          // </tbody>
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
