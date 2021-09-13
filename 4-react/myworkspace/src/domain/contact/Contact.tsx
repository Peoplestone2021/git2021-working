import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { addContact, ContactItem } from "./contactSlice";

const getTimeString = (unixtime: number) => {
  const dateTime = new Date(unixtime);
  const day = 24 * 60 * 60 * 1000;
  return unixtime - new Date().getTime() >= day
    ? dateTime.toLocaleDateString()
    : dateTime.toLocaleTimeString();
  // return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
};

const Contact = () => {
  // const { id } = useParams<{ id: string }>();

  const contact = useSelector((state: RootState) => state.contact);
  const contactData = useSelector((state: RootState) => state.contact.data);
  const history = useHistory();

  const dispatch = useDispatch<AppDispatch>();

  const nameRef = useRef<HTMLInputElement>(null);
  const numRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);

  // console.log("1" + tbRef);
  // if (!tbRef) return;

  // console.log(contactData.toString());
  // console.log(contactData[0]);
  const handleAddClick = () => {
    const item: ContactItem = {
      id: contactData.length > 0 ? contactData[0].id + 1 : 1,
      name: nameRef.current?.value,
      phoneNumber: numRef.current?.value,
      eMail: mailRef.current?.value,
      createdTime: new Date().getTime(),
    };
    dispatch(addContact(item));
  };

  return (
    <>
      <div style={{ width: "40vw" }} className="mx-auto">
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
              handleAddClick();
            }}
          >
            추가
          </button>
        </form>
        <table className="table table-hover table-striped w-100">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">이름</th>
              <th scope="col">전화번호</th>
              <th scope="col">e-메일</th>
              <th scope="col">등록일</th>
              {/* <th scope="col" className="text-center" style={{ width: "10%" }}>
              수정
            </th> */}
            </tr>
          </thead>
          {contact.data.map((item, index) => (
            <tbody key={`contact-item-${index}`} id="tr-list">
              <tr
                style={{ cursor: "pointer" }}
                onClick={() => {
                  history.push(`/contacts/detail/${item.id}`);
                }}
              >
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.eMail}</td>
                <td>{getTimeString(item.createdTime)}</td>
              </tr>
            </tbody>
          ))}
          {!contactData.length && (
            <tfoot id="tfoot">
              <tr id="empty">
                <td colSpan={5} className="text-center">
                  데이터를 입력해 주세요.
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
};

export default Contact;
