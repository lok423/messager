export enum Action {
    JOINED,
    LEFT,
    RENAME,
    TIME
}

export interface UpdateMsgRead {
	  currentUserName : string,
    selectedUserName: string,
    createdAt:Date

}
