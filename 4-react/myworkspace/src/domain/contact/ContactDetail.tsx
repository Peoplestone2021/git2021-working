import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
// import { ContactItem } from "./contactSlice";
import { removeContact } from "./contactSlice";

const ContactDetail = () => {
  // useParams<type>, 매개변수들을 객체화할 형식
  // Generic<type>: 타입을 매개변수로 넣음
  // 타입에 따라서 처리를 다르게 하기위함
  // 객체지향 다형성(poly mophism): 같은 이름의 함수가 내부적으로 처리를 다르게해줌

  const { id } = useParams<{ id: string }>();

  // 타입단언을 하지 않으면 추론에 의해서 contactItem|undefined 타입이 됨
  const contactItem = useSelector((state: RootState) =>
    state.contact.data.find((item) => item.id === +id)
  );
  //  as ContactItem;
  // 타입 단언 (type assertion)

  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const handDeleteClick = () => {
    dispatch(removeContact(+id)); // id값만 넣어서 삭제
    history.push("/contacts"); // 목록화면으로 이동
  };

  return (
    <div style={{ width: "40vw" }} className="mx-auto">
      <h2>Contact Detail</h2>
      <table>
        <tbody>
          <tr>
            <th>이름</th>
            <td>{contactItem?.name}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td>{contactItem?.phoneNumber}</td>
          </tr>
          <tr>
            <th>e-Mail</th>
            <td>
              <td>{contactItem?.eMail}</td>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex">
        <div style={{ width: "50%" }}>
          <button
            className="btn btn-secondary me-1 float-left"
            onClick={() => {
              history.push("/photos");
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
