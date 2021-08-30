interface FeedState {
  id: number;
  userimg?: string | undefined;
  username?: string | undefined;
  content?: string | undefined;
  dataUrl: string | undefined;
  fileType: string | undefined;
  createTime: number;
  modifyTime?: number;
  isEdit?: boolean; // 수정모드인지 여부
  isModified?: boolean;
}

export type { FeedState };
