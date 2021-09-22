import axios from "axios";

interface ContactItemResponse {
  id: number;
  name: string;
  phoneNumber: string;
  eMail: string;
  memo: string;
  createdTime: number;
}

const contactApi = {
  fetch: () =>
    axios.get<ContactItemResponse[]>(
      `${process.env.REACT_APP_API_BASE}/contactsSlice`
    ),
};

export default contactApi;
