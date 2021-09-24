import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { removeContact } from "./contactSlice";
import { requestRemoveContact } from "./contactSaga";

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const contactItem = useSelector((state: RootState) =>
    state.contact.data.find((item) => item.id === +id)
  );

  const isRemoveCompleted = useSelector(
    (state: RootState) => state.contact.isRemoveCompleted
  );

  console.log(contactItem);

  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    isRemoveCompleted && history.push("/contacts");
  }, [isRemoveCompleted, history]);

  const handDeleteClick = () => {
    dispatch(requestRemoveContact(+id)); // id값만 넣어서 삭제
    history.push("/contacts"); // 목록화면으로 이동
  };

  return (
    <div style={{ width: "40vw" }} className="mx-auto">
      <h2 className="text-center">Contact Detail</h2>
      {!contactItem && (
        <div className="text-center my-5">데이터가 없습니다.</div>
      )}
      {contactItem && (
        <table>
          <tbody>
            <tr>
              <th>이름</th>
              <td>{contactItem.name}</td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>{contactItem.phoneNumber}</td>
            </tr>
            <tr>
              <th>e-Mail</th>
              <td>
                <td>{contactItem.email}</td>
              </td>
            </tr>
            <tr>
              <th>메모</th>
              <td>
                <td>{contactItem.memo}</td>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <div className="d-flex">
        <div style={{ width: "50%" }}>
          <button
            className="btn btn-secondary me-1 float-left"
            onClick={() => {
              history.push("/contacts");
            }}
          >
            <i className="bi bi-grid-3x3-gap me-1"></i>
            목록
          </button>
        </div>
        <div style={{ width: "50%" }} className="d-flex justify-content-end">
          <button
            className="btn btn-primary me-1"
            onClick={() => {
              history.push(`/contacts/edit/${id}`);
            }}
          >
            <i className="bi bi-pencil me-1"></i>
            수정
          </button>
          <button
            className="btn btn-primary me-1"
            onClick={() => {
              handDeleteClick();
            }}
          >
            <i className="bi bi-trash me-1"></i>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
