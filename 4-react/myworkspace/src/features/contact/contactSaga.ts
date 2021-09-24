import contactReducer, {
  addContact,
  removeContact,
  modifyContact,
  initialContact,
  initialCompleted,
} from "./contactSlice";
import { createAction, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { ContactItem } from "./contactSlice";
import { call, put, takeEvery, takeLatest } from "@redux-saga/core/effects";
import api, { ContactItemRequest, ContactItemResponse } from "./contactApi";
import { AxiosResponse } from "axios";
import {
  endProgress,
  startProgress,
} from "../../components/progress/progressSlice";
import { addAlert } from "../../components/alert/alertSlice";

export const requestAddContact = createAction<ContactItem>(
  `${contactReducer.name}/requestAddContact`
);

export const requestFetchContacts = createAction(
  `${contactReducer.name}/requestFetchContacts`
);

export const requestRemoveContact = createAction<number>(
  `${contactReducer.name}/requestRemoveContact`
);

export const requestModifyContact = createAction<ContactItem>(
  `${contactReducer.name}/requestModifyContact`
);

function* addData(action: PayloadAction<ContactItem>) {
  yield console.log("--addData--");
  yield console.log(action);

  try {
    const contactItemPayload = action.payload;

    const contactItemRequest: ContactItemRequest = {
      name: contactItemPayload.name,
      phoneNumber: contactItemPayload.phoneNumber,
      email: contactItemPayload.email,
      memo: contactItemPayload.memo,
    };

    yield put(startProgress());

    const result: AxiosResponse<ContactItemResponse> = yield call(
      api.add,
      contactItemRequest
    );

    yield put(endProgress());

    const contactItem: ContactItem = {
      id: result.data.id,
      name: result.data.name,
      phoneNumber: result.data.phoneNumber,
      email: result.data.email,
      memo: result.data.memo,
      createdTime: result.data.createdTime,
    };
    yield put(addContact(contactItem));

    yield put(initialCompleted());

    yield put(
      addAlert({ id: nanoid(), variant: "success", message: "저장되었습니다." })
    );
  } catch (e: any) {
    yield put(endProgress());

    yield put(
      addAlert({ id: nanoid(), variant: "danger", message: e.message })
    );
  }
}

function* fetchData() {
  yield console.log("--fetchData--");

  yield put(startProgress());

  const result: AxiosResponse<ContactItemResponse[]> = yield call(api.fetch);

  yield put(endProgress());

  const contacts = result.data.map(
    (item) =>
      ({
        id: item.id,
        name: item.name,
        phoneNumber: item.phoneNumber,
        email: item.email,
        memo: item.memo,
        createdTime: item.createdTime,
      } as ContactItem)
  );
  yield put(initialContact(contacts));
}

function* removeData(action: PayloadAction<number>) {
  yield console.log("--removeData--");

  const id = action.payload;

  yield put(startProgress());

  const result: AxiosResponse<boolean> = yield call(api.remove, id);

  yield put(endProgress());

  if (result.data) {
    // state 변경(1건삭제)
    yield put(removeContact(id));
  }

  yield put(initialCompleted());
}

function* modifyData(action: PayloadAction<ContactItem>) {
  yield console.log("--modifyData--");

  const contactItemPayload = action.payload;

  const contactItemRequest: ContactItemRequest = {
    name: contactItemPayload.name,
    phoneNumber: contactItemPayload.phoneNumber,
    email: contactItemPayload.email,
    memo: contactItemPayload.memo,
  };

  yield put(startProgress());

  const result: AxiosResponse<ContactItemResponse> = yield call(
    api.modify,
    contactItemPayload.id,
    contactItemRequest
  );

  yield put(endProgress());

  const contactItem: ContactItem = {
    id: result.data.id,
    name: result.data.name,
    phoneNumber: result.data.phoneNumber,
    email: result.data.email,
    memo: result.data.memo,
    createdTime: result.data.createdTime,
  };

  yield put(modifyContact(contactItem));

  yield put(initialCompleted());
}

export default function* contactSaga() {
  yield takeEvery(requestAddContact, addData);

  yield takeLatest(requestFetchContacts, fetchData);

  yield takeEvery(requestRemoveContact, removeData);

  yield takeEvery(requestModifyContact, modifyData);
}
