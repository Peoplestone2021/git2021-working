import contactReducer, {
  addContact,
  removeContact,
  modifyContact,
  initialContact,
  initialCompleted,
  initialPagedContact,
  ContactPage,
} from "./contactSlice";
import { createAction, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { ContactItem } from "./contactSlice";
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "@redux-saga/core/effects";
import api, {
  ContactItemRequest,
  ContactItemResponse,
  ContactPagingResponse,
} from "./contactApi";
import { AxiosResponse } from "axios";
import {
  endProgress,
  startProgress,
} from "../../components/progress/progressSlice";
import { addAlert } from "../../components/alert/alertSlice";
import { RootState } from "../../store";

export interface PageRequest {
  page: number;
  size: number;
}

export const requestAddContact = createAction<ContactItem>(
  `${contactReducer.name}/requestAddContact`
);

export const requestFetchContacts = createAction(
  `${contactReducer.name}/requestFetchContacts`
);

export const requestFetchPagingContacts = createAction<PageRequest>(
  `${contactReducer.name}/requestFetchPagingContacts`
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

    const contactData: ContactItem[] = yield select(
      (state: RootState) => state.contact.data
    );
    // ?????? ???????????? ?????????
    if (contactData.length > 0) {
      // ?????? ????????? ????????? id?????? ???????????? ?????????
      const deleteId = contactData[contactData.length - 1].id;
      yield put(removeContact(deleteId));
    }

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
      addAlert({ id: nanoid(), variant: "success", message: "?????????????????????." })
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

function* fetchPagingData(action: PayloadAction<PageRequest>) {
  yield console.log("--fetchPagingData--");

  const page = action.payload.page;
  const size = action.payload.size;

  // spinner ????????????
  yield put(startProgress());

  try {
    // ??????????????? ????????? ????????????
    const result: AxiosResponse<ContactPagingResponse> = yield call(
      api.fetchPaging,
      page,
      size
    );

    // spinner ???????????? ??????
    yield put(endProgress());

    // ????????? ????????? ???????????? Payload ????????? ??????
    const photoPage: ContactPage = {
      // ???????????????????????? ??????????????????????????? ??????
      // PhotoItemReponse[] => PhotoItem[]
      data: result.data.content.map(
        (item) =>
          ({
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            email: item.email,
            memo: item.memo,
            createdTime: item.createdTime,
          } as ContactItem)
      ),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      page: result.data.number,
      pageSize: result.data.size,
      isLast: result.data.last,
    };

    // state ????????? reducer ??????
    yield put(initialPagedContact(photoPage));
  } catch (e: any) {
    yield put(endProgress());

    yield put(
      addAlert({ id: nanoid(), variant: "danger", message: e.message })
    );
  }
}

function* removeData(action: PayloadAction<number>) {
  yield console.log("--removeData--");

  const id = action.payload;

  yield put(startProgress());

  const result: AxiosResponse<boolean> = yield call(api.remove, id);

  yield put(endProgress());

  if (result.data) {
    // state ??????(1?????????)
    yield put(removeContact(id));
  } else {
    yield put(
      addAlert({
        id: nanoid(),
        variant: "danger",
        message: "????????? ???????????? ???????????????.",
      })
    );
  }

  yield put(initialCompleted());

  const page: number = yield select((state: RootState) => state.contact.page);
  const size: number = yield select(
    (state: RootState) => state.contact.pageSize
  );

  yield put(requestFetchPagingContacts({ page, size }));
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
  yield takeLatest(requestFetchPagingContacts, fetchPagingData);

  yield takeEvery(requestRemoveContact, removeData);

  yield takeEvery(requestModifyContact, modifyData);
}
