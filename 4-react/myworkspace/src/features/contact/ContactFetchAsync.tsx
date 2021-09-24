import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { RootState } from "../../store";
// import { addContact, ContactItem } from "./contactSlice";
import api from "./contactApi";

interface ContactItemState {
  id: number;
  name: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
  memo?: string | undefined;
  createdTime: number;
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
  // const { id } = useParams<{ id: string }>();
  const [contactList, setContactList] = useState<ContactItemState[]>([]);

  const contact = useSelector((state: RootState) => state.contact);
  const contactData = useSelector((state: RootState) => state.contact.data);
  const history = useHistory();

  const fetchData = async () => {
    const res = await api.fetch();

    const contacts = res.data.map((item) => ({
      id: item.id,
      name: item.name,
      phoneNumber: item.phoneNumber,
      email: item.email,
      memo: item.memo,
      createdTime: item.createdTime,
    })) as ContactItemState[];

    setContactList(contacts); // todo state 업데이트
  };

  useEffect(() => {
    console.log("--1. mounted--");
    // 백엔드에서 데이터를 받아올 것임
    // ES8 style로 async-await 기법을 이용해서 데이터를 조회해옴
    fetchData();
  }, []);

  return (
    <>
      <div style={{ width: "40vw" }} className="mx-auto">
        <h2 className="text-center my-5">연락처 관리</h2>
        <div className="d-md-flex justify-content-md-end">
          <button
            id="btn-add"
            type="button"
            className="btn btn-primary text-nowrap"
            onClick={() => {
              history.push("/contacts/create");
            }}
          >
            추가
          </button>
        </div>
        {/* </form> */}
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
                <td>{item.email}</td>
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
