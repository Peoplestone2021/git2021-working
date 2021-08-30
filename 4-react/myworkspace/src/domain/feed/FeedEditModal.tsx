import { clear } from "console";
import { useRef } from "react";
import { FeedState } from "./type";

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
  const modalTxtRef = useRef<HTMLTextAreaElement>(null);
  const modalFileRef = useRef<HTMLInputElement>(null);
  // if (!txtRef) return;

  const save = () => {
    if (modalFileRef.current?.files?.length) {
      const file = modalFileRef.current?.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        post(reader.result?.toString(), file.type);
      };
    } else {
      post(undefined, undefined);
    }
  };
  const post = (
    dataUrl: string | undefined,
    fileType: string | undefined
    // modifyTime: number
  ) => {
    const feed: FeedState = {
      id: item.id,
      content: modalTxtRef.current?.value, // 수정된 입력값
      dataUrl: dataUrl,
      fileType: fileType?.toString(),
      createTime: new Date().getTime(),
      // modifyTime: modifyTime,
    };
    console.log("feed" + feed);
    onSave(feed);
  };

  const add = (e: React.KeyboardEvent<HTMLInputElement> | null) => {
    if (e) {
      if (e.code !== "Enter") return;
    }
  };

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
