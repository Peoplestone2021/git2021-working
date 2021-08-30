// import { clear } from "console";
import { useRef, useState } from "react";
import { FeedState } from "./type";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import produce from "immer";

// { 함수속성 }
// 함수속성의 타입: (매개변수타입) => 리턴타입
// 함수(ex. 부모state제어)를 부모 컴포넌트로 부터 매개변수(prop)를 받음
// 자식컴포넌트에서 이벤트가 발생하면 prop으로 받은 함수를 실행

interface ModalProp {
  item: FeedState;
  onClose: () => void; // 콜백함수
  onSave: (editItem: FeedState) => void; // 콜백함수
}

const FeedEditModal = ({ item, onClose, onSave }: ModalProp) => {
  const profile = useSelector((state: RootState) => state.profile);

  // const [feedList, setFeedList] = useState<FeedState[]>([]); // test

  const modalTxtRef = useRef<HTMLTextAreaElement>(null);
  const modalFileRef = useRef<HTMLInputElement>(null);

  const [isModified, setModified] = useState(false);

  const add = (e: React.KeyboardEvent<HTMLInputElement> | null) => {
    if (e) {
      if (e.code !== "Enter") return;
    }
    if (modalFileRef.current?.files?.length) {
      const file = modalFileRef.current?.files[0];
      const reader = new FileReader();
      const username = profile.username;
      reader.readAsDataURL(file);
      // const dataUrl = reader.result;

      reader.onload = () => {
        replace(reader.result?.toString(), file.type);
      };
    } else {
      replace(undefined, undefined);
    }
    setModified(true);
  };

  const replace = (
    dataUrl: string | undefined,
    fileType: string | undefined
  ) => {
    const feed: FeedState = {
      id: item.id,
      userimg: item.userimg,
      username: item.username,
      content: item.content, // 수정된 입력값
      dataUrl: dataUrl,
      fileType: fileType?.toString(),
      createTime: item.createTime,
    };
    onSave(feed);
  };

  // const save = (editItem: FeedState) => {
  //     console.log(editItem);
  //   };

  const save = () => {
    const feed: FeedState = {
      id: item.id,
      userimg: item.userimg,
      username: item.username,
      content: modalTxtRef.current?.value,
      dataUrl: item.dataUrl,
      fileType: item.fileType,
      createTime: item.createTime,
      modifyTime: new Date().getTime(),
    };
    onSave(feed);
  };

  // setFeedList(
  //   produce((state) => {
  //     const item = state.find((item) => item.id === editItem.id);
  //     if (item) {
  //       // item.id = editItem.id;
  //       // item.userimg=editItem.userimg;
  //       item.content = editItem.content;
  //       // item.dataUrl = editItem.dataUrl;
  //       // item.fileType = editItem.fileType;
  //       item.modifyTime = new Date().getTime();
  //       item.isModified = false;
  //     }
  //   })
  // );
  //   fileType: string | undefined,)

  // const post = (
  //   dataUrl: string | undefined,
  //   fileType: string | undefined,
  //   // username: string | undefined
  //   // modifyTime: number
  // ) => {
  //   const feed: FeedState = {
  //     id: item.id,
  //     userimg: item.userimg,
  //     username: item.username,
  //     content: modalTxtRef.current?.value, // 수정된 입력값
  //     dataUrl: dataUrl,
  //     fileType: fileType?.toString(),
  //     // createTime: new Date().getTime(),
  //     modifyTime: new Date().getTime(),
  //   };
  //   console.log("feed" + feed);
  //   onSave(feed);
  // };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={() => {
        onClose();
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">EDIT FEED</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                onClose();
              }}
            ></button>
          </div>
          <div className="modal-body">
            {/* 이부분 확인 필요 */}
            {!isModified && (
              <div defaultValue={item.dataUrl}>
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
              </div>
            )}
            {isModified && (
              <div>
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
              </div>
            )}
            <div className="d-flex mb-1">
              <input
                type="file"
                className="form-control me-1"
                accept="image/png, image/jpeg, video/mp4"
                ref={modalFileRef}
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
            <textarea
              defaultValue={item.content}
              // rows="5"
              className="form-control mb-1 w-100"
              ref={modalTxtRef}
              style={{ boxSizing: "border-box", height: "15vh" }}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
              }}
            >
              닫기
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                save();
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedEditModal;
