import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Message,DrawImg, UploadFile } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';

//const SERVER_URL = 'http://localhost:8080';
const SERVER_URL = 'http://192.168.1.76:8080';

@Injectable()
export class SocketService {
     socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }
/*
    public send(message: Message): void {
        this.socket.emit('message', message);
    }
    */

    public send(message: Message): void {
        this.socket.emit('getMsg', message);
    }

    public init(username): void {
        this.socket.emit('username', username);
        console.log("emitted username");
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
}
