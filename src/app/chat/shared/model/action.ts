export enum Action {
    JOINED,
    LEFT,
    RENAME,
    TIME
}

export interface UpdateMsgRead {
	  currentUserId : number,
    selectedUserId: number,
    createdAt:Date

}
