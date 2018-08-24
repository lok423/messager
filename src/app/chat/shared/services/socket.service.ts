import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Message,DrawImg, UploadFile, UploadImg } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';

//const SERVER_URL = 'http://localhost:8080';
import { appConfig } from '../../../app.config';
import { UpdateMsgRead } from '../model/action';

const SERVER_URL = 'https://intense-headland-70474.herokuapp.com';
const ERROR = new Error('Ooops!');
//const currentUser = JSON.parse(localStorage.getItem('currentUser'));




@Injectable()
export class SocketService {
     socket;
    public initSocket(): void {

      this.socket = socketIo(appConfig.apiUrl);

/*
   const promise =
        new Promise((resolve, reject) => {
          var token =localStorage.currentUser.token;

        if (token) resolve(this.socket = socketIo(appConfig.apiUrl,{
      query: {token: token}
      }));

    })*/


    }
/*
    public send(message: Message): void {
        this.socket.emit('message', message);
    }
    */

    public send(message: Message): void {
        this.socket.emit('getMsg', message);
    }

    public init(user): void {
        this.socket.emit('user', user);
        console.log("emitted user");
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('sendMsg', (data: Message) => observer.next(data));
        });
    }

    public onOldMessages(): Observable<any>{
      return new Observable<any>(observer => {
          this.socket.on('old msgs', (data: any) => observer.next(data));
      });
    }

    public onUserList(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('userList', (userList: any,id:any) => observer.next(userList));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
    public sendDrawImg(img: DrawImg): void {
        this.socket.emit('getDraw', img);
    }
    public sendFile(file: UploadFile): void {
        this.socket.emit('getFile', file);
    }
    public sendImg(file: UploadImg): void {
      console.log("emit",file);
        this.socket.emit('getImg', file);
    }

    public onDrawImg(): Observable<DrawImg> {
        return new Observable<DrawImg>(observer => {
            this.socket.on('sendDrawImg', (data: DrawImg) => observer.next(data));
        });
    }

    public onFile(): Observable<UploadFile> {
        return new Observable<UploadFile>(observer => {
            this.socket.on('sendFile', (data: UploadFile) => observer.next(data));
        });
    }

    public onImg(): Observable<UploadImg> {
        return new Observable<UploadImg>(observer => {
            this.socket.on('sendImg', (data: UploadImg) => observer.next(data));
        });
    }

    public updateUnreadMsg(msg_read: UpdateMsgRead): void{
      this.socket.emit('message_Read', msg_read);
    }
}
