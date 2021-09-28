import axios from "axios";

export interface ContactPagingResponse {
  content: ContactItemResponse[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ContactItemResponse {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  memo: string;
  createdTime: number;
}

export interface ContactItemRequest {
  name?: string;
  phoneNumber?: string;
  email?: string;
  memo?: string;
}

const contactApi = {
  fetch: () =>
    axios.get<ContactItemResponse[]>(
      `${process.env.REACT_APP_API_BASE}/contacts`
    ),
  fetchPaging: (page: number, size: number) =>
    axios.get<ContactPagingResponse>(
      `${process.env.REACT_APP_API_BASE}/contacts/paging?page=${page}&size=${size}`
    ),

  add: (contactItem: ContactItemRequest) =>
    axios.post<ContactItemResponse>(
      `${process.env.REACT_APP_API_BASE}/contacts`,
      contactItem
    ),
  remove: (id: number) =>
    axios.delete<boolean>(`${process.env.REACT_APP_API_BASE}/contacts/${id}`),
  modify: (id: number, contactItem: ContactItemRequest) =>
    axios.put<ContactItemResponse>(
      `${process.env.REACT_APP_API_BASE}/contacts/${id}`,
      contactItem
    ),
};

export default contactApi;
