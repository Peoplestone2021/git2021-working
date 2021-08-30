import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../domain/profile/profileSlice";

// global state(전역상태) 저장소

// 프론트엔드 state: UI 처리 바뀌게 하는 변수
//      -> 모달 팝업상태(보이고 안보이고), 연락처 목록상태(10개 5개 갯수, 수정모드)

// 백엔드 state: 비즈니스 로직 처리가 바뀌게 하는 데이터
//      -> 주문상태(주문요청, 결제, 결제확인, 배송중, 배송완료)
//      -> 승인상태 (제출, 검토 중, 반려, 승인)

// global state: profile, todo, caontact ... 여러개 state가 있음
// ** 이러한 statr들은 다른 컴포넌트와 state가 공유됨
export const store = configureStore({
  // 각 state별로 처리할 reducer 목록
  reducer: {
    // profile state 처리하는 reducer를 등록
    profile: profileReducer,
  },
  devTools: true, // 개발툴 사용 여부
});

// typescript에서는 몇가지 type선언을 해야해

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// dispatch함수의 generic type
export type AppDispatch = typeof store.dispatch;
