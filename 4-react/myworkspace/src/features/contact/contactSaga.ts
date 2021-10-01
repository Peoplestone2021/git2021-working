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
    // 현재 데이터가 있으면
    if (contactData.length > 0) {
      // 가장 마지막 요소의 id값을 가져오고 삭제함
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

function* fetchPagingData(action: PayloadAction<PageRequest>) {
  yield console.log("--fetchPagingData--");

  const page = action.payload.page;
  const size = action.payload.size;

  // spinner 보여주기
  yield put(startProgress());

  try {
    // 백엔드에서 데이터 받아오기
    const result: AxiosResponse<ContactPagingResponse> = yield call(
      api.fetchPaging,
      page,
      size
    );

    // spinner 사라지게 하기
    yield put(endProgress());

    // 받아온 페이지 데이터를 Payload 변수로 변환
    const photoPage: ContactPage = {
      // 응답데이터배열을 액션페이로드배열로 변환
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

    // state 초기화 reducer 실행
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
    // state 변경(1건삭제)
    yield put(removeContact(id));
  } else {
    yield put(
      addAlert({
        id: nanoid(),
        variant: "danger",
        message: "오류로 저장되지 않았습니다.",
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
