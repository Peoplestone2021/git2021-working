import React, { useRef, useState } from "react";
import Alert from "./base/Alert";

interface FeedState {
  id: number;
  memo: string | undefined;
  createTime: number;
  modifyTime?: number;
  // isEdit?:boolean;
}

const getTimeString = (unixtime: number) => {
  const dateTime = new Date(unixtime);
  return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleDateString()}`;
};

const Feed = () => {
  const [feedList, setFeedList] = useState<FeedState[]>([
    { id: 2, memo: "Typescript", createTime: new Date().getTime() },
    { id: 1, memo: "React State 연습", createTime: new Date().getTime() },
  ]);

  const [isError, setIsError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const txtRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const add = (e: React.KeyboardEvent<HTMLInputElement> | null) => {
    if (e) {
      if (e.code !== "Enter") return;
    }

    if (!inputRef.current?.value && !fileRef.current?.value) {
      setIsError(true);
      return;
    }

    const reader = new FileReader();
    let media = "";

    reader.readAsDataURL = () => {
      reader.onload = () => {
        const dataUrl = reader.result;

        if (e?.type.includes("image")) {
          media = /*html*/ `<img src=${dataUrl} class="card-img-top">`;
        } else {
          media = /*html*/ `
              <video class="card-img-top" controls>
                <source src=${dataUrl} type="video/mp4"></source>
              </video>`;
        }
      };
    };

    const feed: FeedState = {
      id: feedList.length > 0 ? feedList[0].id + 1 : 1,
      // optional chaning
      memo: inputRef.current?.value,
      createTime: new Date().getTime(),
    };

    setFeedList([feed, ...feedList]);

    formRef.current?.reset();

    setIsError(false);
  };

  const del = (id: number) => {
    setFeedList(feedList.filter((item) => item.id !== id));
  };

  const save = (id: number, index: number) => {};

  // const edit=()=>{};

  return (
    <>
      <h2 className="text-center my-5">Feed</h2>
      <form
        className="form-control mb-1 w-100"
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
      >
        <textarea
          id="txt-post"
          // rows="5"
          className="form-control mb-1"
          // ref={inputRef}
          placeholder="Leave a post here"
        />
        <div className="d-flex">
          <input
            type="file"
            className="form-control me-1"
            accept="image/png, image/jpeg, video.mp4"
          />
          <button className="btn btn-primary text-nowrap" type="button">
            입력
          </button>
        </div>
      </form>
      {isError && (
        <Alert
          message={"내용을 입력해주세요."}
          variant={"danger"}
          // 닫기 버튼을 클릭할 때 처리하는 함수를 넘김
          onClose={() => {
            setIsError(false);
          }}
        />
      )}
      <div className="mt-3"></div>
    </>
  );
};
export default Feed;
