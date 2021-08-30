interface FeedState {
  id: number;
  content: string | undefined;
  dataUrl: string | undefined;
  fileType: string | undefined;
  createTime: number;
  modifyTime?: number;
  isEdit?: boolean; // 수정모드인지 여부
}

export type { FeedState };
