import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { ContactItem, addContact } from "./contactSlice";

const ContactCreate = () => {
  const history = useHistory();
  const contactData = useSelector((state: RootState) => state.contact.data);
  // const profile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();

  const name = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const eMail = useRef<HTMLInputElement>(null);
  const memo = useRef<HTMLTextAreaElement>(null);
  // const createdTime;

  const handleAddClick = () => {
    const item: ContactItem = {
      id: contactData.length ? contactData[0].id + 1 : 1,
      name: name.current ? name.current.value : "",
      phoneNumber: phoneNumber.current ? phoneNumber.current.value : "",
      eMail: eMail.current ? eMail.current.value : "",
      memo: memo.current?.value,
      createdTime: new Date().getTime(),
    };

    // redux store에 photo state에 item을 추가
    dispatch(addContact(item));
    // 포토 목록으로 이동
    history.push("/contacts");
  };

  return (
    <div style={{ width: "40vw" }} className="mx-auto">
      <h2 className="text-center">Contact Create</h2>{" "}
      <form>
        <table className="table">
          <tbody>
            <tr>
              <th>이름</th>
              <td>
                <input className="form-control" type="text" ref={name} />
              </td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>
                <input className="form-control" type="text" ref={phoneNumber} />
              </td>
            </tr>
            <tr>
              <th>E-Mail</th>
              <td>
                <input className="form-control" type="text" ref={eMail} />
              </td>
            </tr>
            <tr>
              <th>메모</th>
              <td>
                <textarea
                  className="form-control"
                  style={{ height: "40vh" }}
                  ref={memo}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-secondary me-1"
          onClick={() => {
            history.push("/contacts");
          }}
        >
          <i className="bi bi-grid-3x3-gap me-1"></i>
          목록
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            handleAddClick();
          }}
        >
          <i className="bi bi-check" />
          저장
        </button>
      </div>
    </div>
  );
};

export default ContactCreate;
