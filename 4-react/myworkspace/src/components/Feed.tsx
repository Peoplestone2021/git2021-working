import React, { useRef, useState } from "react";
import Alert from "./base/Alert";
import produce from "immer";

interface FeedState {
  id: number;
  content?: string | undefined;
  dataUrl?: string | undefined;
  fileType?: string | undefined;
  createTime: number;
  // modifyTime?: number;
  // isEdit?:boolean;
}

const getTimeString = (unixtime: number) => {
  const dateTime = new Date(unixtime);
  return `${dateTime.toLocaleDateString()}`;
};

const Feed = () => {
  const [feedList, setFeedList] = useState<FeedState[]>([]);

  // const inputRef = useRef<HTMLInputElement>(null);
  const txtRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isError, setIsError] = useState(false);

  const add = (e: React.KeyboardEvent<HTMLInputElement> | null) => {
    if (e) {
      if (e.code !== "Enter") return;
    }

    if (!txtRef.current?.value && !fileRef.current?.value) {
      setIsError(true);
      return;
    }

    if (fileRef.current?.files?.length) {
      const file = fileRef.current?.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataUrl = reader.result;

          console.log(dataUrl);

          if (!dataUrl) return;
          // if (dataUrl !== null) {
          const feed: FeedState = {
            id: feedList.length > 0 ? feedList[0].id + 1 : 1,
            // optional chaning
            content: txtRef.current?.value,
            dataUrl: dataUrl.toString(),
            fileType: file.type,
            createTime: new Date().getTime(),
          };
          // }
          // setFeedList([feed, ...feedList]);
          setFeedList(
            produce((state) => {
              state.unshift(feed);
            })
          );
        };
      } else {
        formRef.current?.reset();
      }
    }

    setIsError(false);
    formRef.current?.reset();
  };

  // const post = (
  //   dataUrl: string | undefined,
  //   fileType: string | undefined
  // ) => {};

  const del = (id: number) => {
    setFeedList(feedList.filter((item) => item.id !== id));
  };

  // const save = (id: number, index: number) => {
  //   const input = divRef.current?.querySelectorAll("input")[index];

  //   setFeedList(
  //     produce((state) => {
  //       const item = state.find((item) => item.id === id);
  //       if (item) {
  //         item.content = input?.value;
  //         // item.modifyTime = new Date().getTime();
  //         // item.isEdit = false;
  //       }
  //     })
  //   );
  // };

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
          className="form-control mb-1"
          style={{ boxSizing: "border-box", height: "15rem" }}
          placeholder="Leave a post here"
          ref={txtRef}
        />
        <div className="d-flex">
          <input
            type="file"
            className="form-control me-1"
            accept="image/png, image/jpeg, video/mp4"
            ref={fileRef}
          />
          <button
            className="btn btn-primary text-nowrap"
            type="button"
            onClick={() => {
              add(null);
            }}
          >
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
      <div className="mt-3">
        {feedList.length === 0 && (
          <div className="card mt-1">데이터가 없습니다.</div>
        )}
        {feedList.map((item) => (
          <div className="card d-flex" key={item.id}>
            {item.fileType &&
              (item.fileType?.includes("image") ? (
                <img
                  src={item.dataUrl}
                  className="card-img-top"
                  alt={item.content}
                />
              ) : (
                <video className="card-img-top" controls>
                  <source src={item.dataUrl} type="video/mp4"></source>
                </video>
              ))}
            <div className="card-body">
              <p className="card-text">{item.content}</p>
              <div className="d-flex">
                <div className="w-100">
                  <span className="text-secondary">
                    {getTimeString(
                      // item.modifyTime?item.modifyTime:
                      item.createTime
                    )}
                  </span>
                </div>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    del(item.id);
                  }}
                  className="link-secondry fs-6 text-nowrap"
                >
                  삭제
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Feed;
