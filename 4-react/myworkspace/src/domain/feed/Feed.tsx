import React, { useRef, useState } from "react";
import Alert from "../../components/base/Alert";
import produce from "immer";
import FeedEditModal from "./FeedEditModal";
import { FeedState } from "./type";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import style from "./Feed.module.scss";

const getTimeString = (unixtime: number) => {
  const dateTime = new Date(unixtime);
  const day = 24 * 60 * 60 * 1000;
  return unixtime - new Date().getTime() >= day
    ? dateTime.toLocaleDateString()
    : dateTime.toLocaleTimeString();
  // return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
};

const Feed = () => {
  const profile = useSelector((state: RootState) => state.profile);

  const [feedList, setFeedList] = useState<FeedState[]>([]);

  const txtRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isError, setIsError] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // console.log("txtRef" + txtRef);
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
      const reader = new FileReader();
      const userimg = profile.image;
      const username = profile.username;

      reader.onload = () => {
        post(reader.result?.toString(), file.type, userimg, username);
      };
      reader.readAsDataURL(file);
    } else {
      post(undefined, undefined, undefined, undefined);
    }
    // const dataUrl = reader.result;

    // if (!dataUrl) return;
  };

  const post = (
    dataUrl: string | undefined,
    fileType: string | undefined,
    userimg: string | undefined,
    username: string | undefined
  ) => {
    const feed: FeedState = {
      id: feedList.length > 0 ? feedList[0].id + 1 : 1,
      // optional chaning
      userimg: profile.image,
      username: profile.username,
      content: txtRef.current?.value,
      dataUrl: dataUrl,
      fileType: fileType?.toString(),
      createTime: new Date().getTime(),
    };
    setFeedList(
      produce((state) => {
        state.unshift(feed);
      })
    );
    formRef.current?.reset();
  };

  // setIsError(false);
  // const [isEdit, setIsEdit] = useState(false);

  const del = (id: number) => {
    setFeedList(feedList.filter((item) => item.id !== id));
  };

  const editItem = useRef<FeedState>({
    id: 0,
    userimg: "",
    username: profile.username,
    content: "",
    dataUrl: "",
    fileType: "",
    createTime: 0,
    // modifyTime: 0,
    // isEdit:
  });

  const edit = (item: FeedState) => {
    editItem.current = item;
    setIsEdit(true);
  };

  const save = (editItem: FeedState) => {
    console.log(editItem);
    setFeedList(
      produce((state) => {
        const item = state.find((item) => item.id === editItem.id);
        if (item) {
          item.content = editItem.content;
          item.dataUrl = editItem.dataUrl;
          // item.fileType = editItem.fileType;
          // item.modifyTime = new Date().getTime();
          // item.isEdit = false;
        }
      })
    );
    setIsEdit(false);
  };

  return (
    <>
      <div style={{ width: "40vw" }} className="mx-auto">
        <h2 className="text-center my-5">Feed</h2>
        {isEdit && (
          <FeedEditModal
            item={editItem.current}
            onClose={() => {
              setIsEdit(false);
            }}
            onSave={(editItem) => {
              save(editItem);
            }}
          />
        )}
        <form
          className="mt-5"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-floating ">
            <textarea
              className="form-control mb-1"
              ref={txtRef}
              style={{ boxSizing: "border-box", height: "15vh" }}
              placeholder="Leave a post here"
            ></textarea>
          </div>
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
            <div className="card mt-1 text-center w-100">
              데이터가 없습니다.
            </div>
          )}
          {feedList.map((item) => (
            <div className="card d-flex" key={item.id}>
              <div className="card-header d-flex">
                <div
                  className={`${style.thumb} me-2 mt-0`}
                  style={{ backgroundImage: `url(${item.userimg})` }}
                ></div>
                {item.username}
              </div>
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
                        item.modifyTime ? item.modifyTime : item.createTime
                      )}
                    </span>
                  </div>
                  <a
                    href="#!"
                    onClick={() => {
                      edit(item);
                    }}
                    className="link-secondary fs-6 text-nowrap"
                  >
                    수정
                  </a>
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      del(item.id);
                    }}
                    className="link-secondary fs-6 text-nowrap"
                  >
                    삭제
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Feed;
