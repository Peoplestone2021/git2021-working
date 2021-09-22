import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { modifyContact } from "./contactSlice";

const ContactEdit = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const contactItem = useSelector((state: RootState) =>
    state.contact.data.find((item) => item.id === +id)
  );

  const dispatch = useDispatch<AppDispatch>();

  const name = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const eMail = useRef<HTMLInputElement>(null);
  const memo = useRef<HTMLTextAreaElement>(null);

  const handleSaveClick = () => {
    // 파일이 있을 때 처리

    if (contactItem) {
      const item = { ...contactItem };
      item.id = contactItem.id;
      item.name = name.current?.value;
      item.phoneNumber = phoneNumber.current?.value;
      item.eMail = eMail.current?.value;
      item.memo = memo.current?.value;
      item.createdTime = new Date().getTime();
      dispatch(modifyContact(item));
      history.push("/contacts");
    }
    // redux store에 contact state에 item을 수정
  };

  return (
    <div style={{ width: "40vw" }} className="mx-auto">
      <h2 className="text-center">Contacts Create</h2>{" "}
      <form>
        <table className="table">
          <tbody>
            <tr>
              <th>이름</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  ref={name}
                  defaultValue={contactItem?.name}
                />
              </td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>
                <input
                  className="form-control"
                  style={{ height: "20vh" }}
                  ref={phoneNumber}
                  defaultValue={contactItem?.phoneNumber}
                ></input>
              </td>
            </tr>
            <tr>
              <th>E-Mail</th>
              <td>
                <input
                  className="form-control"
                  style={{ height: "20vh" }}
                  ref={eMail}
                  defaultValue={contactItem?.eMail}
                ></input>
              </td>
            </tr>
            <tr>
              <th>메모</th>
              <td>
                <textarea
                  className="form-control"
                  style={{ height: "20vh" }}
                  ref={memo}
                  defaultValue={contactItem?.memo}
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
            handleSaveClick();
          }}
        >
          <i className="bi bi-check" />
          저장
        </button>
      </div>
    </div>
  );
};
export default ContactEdit;
