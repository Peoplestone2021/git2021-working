import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContactItem {
  id: number;
  name: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
  memo?: string | undefined;
  createdTime: number;
}

export interface ContactPage {
  data: ContactItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isLast: boolean;
}

interface ContactState {
  data: ContactItem[];
  isFetched: boolean;
  isAddCompleted?: boolean;
  isRemoveCompleted?: boolean;
  isModifyCompleted?: boolean;
  totalElements?: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isLast?: boolean;
}

const contactPageSize = localStorage.getItem("contact_page_size");

const initialState: ContactState = {
  data: [
    // {
    //   id: 3,
    //   name: "홍길동",
    //   phoneNumber: "1111-2222",
    //   eMail: "aaa@bbb.com",
    //   memo: "아무 이름",
    //   createdTime: 0,
    // },
    // {
    //   id: 2,
    //   name: "Sam",
    //   phoneNumber: "3333-4444",
    //   eMail: "ccc@ddd.com",
    //   memo: "someone",
    //   createdTime: 0,
    // },
    // {
    //   id: 1,
    //   name: "James",
    //   phoneNumber: "5555-6666",
    //   eMail: "qqq@www.com",
    //   memo: "guess who",
    //   createdTime: 0,
    // },
  ],
  isFetched: false,
  page: 0,
  pageSize: contactPageSize ? +contactPageSize : 2,
  totalPages: 0,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<ContactItem>) => {
      const contact = action.payload;
      state.data.unshift(contact);
      state.isAddCompleted = true;
      console.log(contact);
    },
    initialCompleted: (state) => {
      delete state.isAddCompleted;
      delete state.isRemoveCompleted;
      delete state.isModifyCompleted;
    },
    removeContact: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.data.splice(
        state.data.findIndex((item) => item.id === id),
        1
      );
      state.isRemoveCompleted = true;
    },
    modifyContact: (state, action: PayloadAction<ContactItem>) => {
      const contact = action.payload;
      const item = state.data.find((item) => item.id === contact.id);
      if (item) {
        item.name = contact.name;
        item.phoneNumber = contact.phoneNumber;
        item.email = contact.email;
        item.memo = contact.memo;
      }
      state.isModifyCompleted = true;
    },
    initialContact: (state, action: PayloadAction<ContactItem[]>) => {
      const contacts = action.payload;
      // 백엔드에서 받아온 데이터
      state.data = contacts;
      // 데이터를 받아옴으로 값을 남김
      state.isFetched = true;
    },
    initialPagedContact: (state, action: PayloadAction<ContactPage>) => {
      // 백엔드에서 받아온 데이터
      // 컨텐트
      state.data = action.payload.data;
      // 페이징 데이터
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.isLast = action.payload.isLast;
      // 데이터를 받아옴으로 값을 남김
      state.isFetched = true;
    },
  },
});

export const {
  addContact,
  removeContact,
  modifyContact,
  initialContact,
  initialCompleted,
  initialPagedContact,
} = contactSlice.actions;

export default contactSlice.reducer;
