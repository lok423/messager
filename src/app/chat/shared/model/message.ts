//import {User} from './user';
//import {Action} from './action';

export interface Message {
  toid : string[],
  fromid: string,
	  msg : string,
	  sender_id : number,
    //createAt: any,
    selfsockets: string[],
    receiver_id: number,
    createdAt:Date

  /*
    from?: User;
    content?: any;
    action?: Action;
    createAt?: number;
    */
}

export interface DrawImg {
  toid : string[],
  fromid: string,
	  //msg : string,
	  sender_id : number,
    //createAt: any,
    selfsockets: string[],
    receiver_id: number,
    drawImg:string,
    createdAt:Date
  /*
    from?: User;
    content?: any;
    action?: Action;
    createAt?: number;
    */
}

export interface UploadFile {
  toid : string[],
  fromid: string,
	  //msg : string,
	  sender_id : number,
    //createAt: any,
    selfsockets: string[],
    receiver_id: number,
    file:string,
    filename:string,
    createdAt:Date
  /*
    from?: User;
    content?: any;
    action?: Action;
    createAt?: number;
    */
}

export interface UploadImg {
  toid : string[],
  fromid: string,
	  //msg : string,
	  sender_id : number,
    //createAt: any,
    selfsockets: string[],
    receiver_id: number,
    img:string,
    imgname:string,
    createdAt:Date
  /*
    from?: User;
    content?: any;
    action?: Action;
    createAt?: number;
    */
}
