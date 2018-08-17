import { Component, OnInit, Input, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, AfterViewChecked, AfterContentChecked,AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem,MAT_DIALOG_DATA } from '@angular/material';
import $ from 'jquery';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

//import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message, DrawImg, UploadFile } from './shared/model/message';
//import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';

import { DrawboardComponent } from '../drawboard/drawboard.component';
import { PreviewImgComponent } from '../preview-img/preview-img.component';
import { HttpResponse } from '@angular/common/http';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';
const upload_URL ='http://localhost:8080/api/upload-file';
//const upload_URL ='http://192.168.1.76:8080/api/upload-file';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  imageData;
  drawboard = false;
  ioConnection: any;
  messageContent: string;
  socketId = null;
  selectedUser = null;
  messages = [];
  msgData = null;
  userList = [];
  username:string;
  selfsockets=[];
  drawImg=null;
  drawWidth=null;
  drawHeight=null;
  allUsersList = [{channelid: '', userName: "mark",online:false},

{channelid: '',userName: "dean",online:false},

{channelid: '',userName: "peter",online:false},

{channelid: '',userName: "edi",online:false},

{channelid: '',userName: "mike",online:false},

{channelid: '',userName: "ken",online:false}];
@Input() emoji=null;
@Input() emoji_status=false;
@ViewChild('inputMessage') private input;
@ViewChild('upload_input') input_file: ElementRef;

selectedFile: File = null;
uploadedPercentage = 0;
showMessage = false;
upload_message: String = '';
showProgressBar = false;



//@ViewChild('scrollMe') private myScrollContainer: ElementRef;



  // getting a reference to the overall list, which is the parent container of the list items
  //@ViewChildren('scrollMe') private myScrollContainer: ElementRef;

  // getting a reference to the items/messages within the list

  constructor(private socketService: SocketService,

    public dialog: MatDialog,private http: HttpClient) { }

  ngOnInit(): void {
    this.username= window.prompt('Enter Your Name');
    console.log(this.messages);

    console.log("drawZone", this.drawWidth,this.drawHeight);
    this.initIoConnection();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      //this.openUserPopup(this.defaultDialogUserParams);
    }, 0);

    $(document).ready(function(){
      var box = document.querySelector('drawZone');
      var width = $( window ).width();
      //var width = $('drawZone').width();
      console.log("width",width);
      //$('body').bind('touchmove', function(e){e.preventDefault()});
    });


  }

  draw() {
    // draw(drawboard) {
    // if(drawboard ==true){
    //   this.drawboard=false;
    // }else{
    //   this.drawboard=true;
    // }

    const dialogRef = this.dialog.open(DrawboardComponent, {
      width: (document.body.clientWidth) + 'px',
      data: {data : this.imageData}
    });
    console.log('-----' + document.body.clientWidth );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.imageData = result;
      // this.sendDrawImg(this.imageData);
      this.sendDrawImg(dialogRef.componentInstance.imgageSrc);
    });
  }

  openEmoji(emoji_status) {
    if(emoji_status ==true){
      this.emoji_status=false;
    }else{
      this.emoji_status=true;
    }
  }

  closeDrawboard(event){
    this.drawboard=false;
  }

  closeEmoji(event) {
    this.emoji_status=false;
  }

  addEmojiText(emoji){
    this.input.nativeElement.focus();
    let startPos = this.input.nativeElement.selectionStart;
    let value = this.input.nativeElement.value;
    this.input.nativeElement.value=
    value.substring(0, startPos) + emoji.emoji.native + value.substring(startPos, value.length);
    if(!this.messageContent){
      this.messageContent =emoji.emoji.native;
    }else{
      this.messageContent=value.substring(0, startPos) + emoji.emoji.native + value.substring(startPos, value.length);
    }
    console.log(emoji);
  }

  selectUser(user){
    this.selectedUser=user;
    console.log(user);

  }

  private loadOnlineUser(allUsers,userList){
    for(var i=0;i<allUsers.length;i++){
      var found =false;
      for(var j=0;j<userList.length;j++){
        if(allUsers[i].userName==userList[j].userName){
          allUsers[i].channelid=userList[j].channelid;
          allUsers[i].online = true;
          found =true;
        }
      }
      if(found==false){
        allUsers[i].online =false;
        allUsers[i].channelid='';
      }
    }
  }


  private initIoConnection(): void {

    this.socketService.initSocket();
    this.socketService.init(this.username);
    console.log("emit ", this.username);
    this.ioConnection = this.socketService.socket.on('userList',(userList,channelid) => {
      if(this.socketId === null){
          this.socketId = channelid;
      }
      this.userList = userList;
      this.getselfsockets();
      this.updateSelectedUser();
      this.loadOnlineUser(this.allUsersList,this.userList);

      //console.log(userList);
      //console.log("userList",this.userList);
      //console.log("socketId",this.socketId);
  });

  this.ioConnection = this.socketService.onMessage()
    .subscribe((message: Message) => {
      this.messages.push(message);
      //console.log(message);

    });

  this.ioConnection = this.socketService.socket.on('exit', (userList) => {
    this.userList = userList;
    this.getselfsockets();
    this.updateSelectedUser();
    this.loadOnlineUser(this.allUsersList,this.userList);

  });

  this.ioConnection = this.socketService.onDrawImg()
    .subscribe((img: DrawImg) => {
      this.messages.push(img);
      console.log("receive draw:");
    });

    this.ioConnection = this.socketService.onFile()
      .subscribe((file: UploadFile) => {
        this.messages.push(file);
        console.log("receive file:",file);

      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });


    this.ioConnection = this.socketService.onOldMessages()
      .subscribe((message: any) => {
        for(var i=0;i<message.length;i++){
          this.messages.push(message[i]);
        }
        console.log("messages history:" ,this.messages);
        //this.scrollToBottom();

      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });

  }
  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
          fromid: this.socketId,
            toid : this.selectedUser.channelid,
          msg : message,
          senderName : this.username,
          receiverName : this.selectedUser.userName,
          //createAt: Date.now(),
          selfsockets: this.selfsockets
    });


    this.messageContent = null;
  }

  getselfsockets(){
    for(var i =0; i<this.userList.length;i++){
      if(this.userList[i].userName==this.username){
        this.selfsockets =this.userList[i].channelid;
      }
    }
    console.log("selfsockets",this.selfsockets);

  }

  updateSelectedUser(){
    if(this.selectedUser){
      for(var i =0; i<this.userList.length;i++){
        if(this.userList[i].userName==this.selectedUser.userName){
          this.selectedUser =this.userList[i];
        }
      }
    }
    console.log("selecteduser", this.selectedUser);
  }

handleDrawOutput(output){
  this.drawImg=output;
  console.log("output",this.drawImg);
  this.sendDrawImg(this.drawImg);
}

public sendDrawImg(img: string): void {
  if (!img) {
    return;
  }
  this.socketService.sendDrawImg({
        fromid: this.socketId,
          toid : this.selectedUser.channelid,
        //msg : message,
        drawImg:img,
        senderName : this.username,
        receiverName : this.selectedUser.userName,
        //createAt: Date.now(),
        selfsockets: this.selfsockets
  });
}

public sendFile(path: string, name: string): void {
  if (!path) {
    return;
  }
  this.socketService.sendFile({
        fromid: this.socketId,
          toid : this.selectedUser.channelid,
        //msg : message,
        filename: name,
        file :path,
        senderName : this.username,
        receiverName : this.selectedUser.userName,
        //createAt: Date.now(),
        selfsockets: this.selfsockets
  });
}

previewImg(img){
  console.log(img);
  const dialogRef = this.dialog.open(PreviewImgComponent, {

    data: { img }
  });
}


  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  onUpload() {
    const fd = new FormData();
    this.showMessage = false;
    console.log(this.selectedFile.name);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post(upload_URL, fd, {
      reportProgress: true, observe: 'events'
    }).subscribe( (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          //this.slimLoadingBarService.start();
          this.showProgressBar=true;
          break;
        case HttpEventType.Response:
        console.log("response", event.body );
          //this.slimLoadingBarService.complete();
          this.upload_message = "Uploaded Successfully";
          this.showMessage = true;
          if(event.body.file_path){
            var file_path = event.body.file_path;
            var file_name = event.body.file_name;
            this.sendFile(file_path,file_name);
            //console.log(file_path);
          }
          this.showProgressBar=false;
          this.uploadedPercentage=0;
          break;
        case 1: {
          if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)){
            this.uploadedPercentage = event['loaded'] / event['total'] * 100;
            //this.slimLoadingBarService.progress = Math.round(this.uploadedPercentage);
          }
          break;
        }
      }
    },
    error => {
      console.log(error);
      this.upload_message = "Something went wrong";
      this.showMessage = true;
      //this.slimLoadingBarService.reset();
    });
  }

  clickUploader(){
    this.input_file.nativeElement.click();
  }
}
