import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { penguin } from "../../common/data";

// redux store(리덕스 저장소)에 하나의 state를 관리하고 처리할 수 있는 모듈 = slice
// slice에는 state와 reducer가 있음
// reducer는 state를 변경하는 함수

export interface ProfileState {
  image: string | undefined;
  username: string | undefined;
}

// state 초기상태를 선언

const initialState: ProfileState = {
  image: penguin,
  username: "Yang Minseok",
};

// slice를 생성
export const profileSlice = createSlice({
  name: "profile", //slice의 이름(동시에 state 이름)
  // initialState: {}, // 이 slice의 state초기값
  initialState,
  reducers: {
    // 함수명:()
    saveProfile: (state, action: PayloadAction<ProfileState>) => {
      // immer가 내장되어 state 변수를 직접제어함
      const profile = action.payload;
      state.image = profile.image;
      state.username = profile.username;

      // state = { ...action.payload }; // 배열자체를 바꾸면 안됨 *금지
    },
  }, // state 변경함수 목록
});

// action creator 내보내기 -> 컴포넌트에서 사용하기 위함
// reducer 함수명에 맞는 action creator들을 createSlice할 때 자동으로 생성함

// action={type: "...", payload:{...}}
// action.type: 처리할 액션의 종류를 나타내는 문자열
// action.payload: 처리할 데이터

// action creator는 action 객체를 생성하는 함수
// saveProfile(payload) => {type:"profile/saveProfile", payload}
export const { saveProfile } = profileSlice.actions;

// slice.reducer
// == state 변경함수를 여러개 가지고있는 객체(함수?)
// == reducer를 여러개 가지고 있는 객체
// slice.reducer: {function..(), function}
export default profileSlice.reducer;
