import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContactItem {
  id: number;
  name: string | undefined;
  phoneNumber: string | undefined;
  eMail: string | undefined;
  memo?: string | undefined;
  createdTime: number;
}

interface ContactState {
  data: ContactItem[];
  isFetched: boolean;
}

const initialState: ContactState = {
  data: [
    {
      id: 3,
      name: "홍길동",
      phoneNumber: "1111-2222",
      eMail: "aaa@bbb.com",
      memo: "아무 이름",
      createdTime: 0,
    },
    {
      id: 2,
      name: "Sam",
      phoneNumber: "3333-4444",
      eMail: "ccc@ddd.com",
      memo: "someone",
      createdTime: 0,
    },
    {
      id: 1,
      name: "James",
      phoneNumber: "5555-6666",
      eMail: "qqq@www.com",
      memo: "guess who",
      createdTime: 0,
    },
  ],
  isFetched: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<ContactItem>) => {
      const contact = action.payload;
      state.data.unshift(contact);
    },
    removeContact: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.data.splice(
        state.data.findIndex((item) => item.id === id),
        1
      );
    },
    modifyContact: (state, action: PayloadAction<ContactItem>) => {
      const contact = action.payload;
      const item = state.data.find((item) => item.id === contact.id);
      if (item) {
        item.name = contact.name;
        item.phoneNumber = contact.phoneNumber;
        item.eMail = contact.eMail;
        item.memo = contact.memo;
      }
    },
  },
});

export const { addContact, removeContact, modifyContact } =
  contactSlice.actions;

export default contactSlice.reducer;
