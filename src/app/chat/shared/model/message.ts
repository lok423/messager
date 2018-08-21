//import {User} from './user';
//import {Action} from './action';

export interface Message {
  toid : string[],
  fromid: string,
	  msg : string,
	  senderName : string,
    //createAt: any,
    selfsockets: string[],
    receiverName: string,
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
	  senderName : string,
    //createAt: any,
    selfsockets: string[],
    receiverName: string,
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
	  senderName : string,
    //createAt: any,
    selfsockets: string[],
    receiverName: string,
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
	  senderName : string,
    //createAt: any,
    selfsockets: string[],
    receiverName: string,
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
