import { Component, OnInit, Input, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, AfterViewChecked, AfterContentChecked,AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem,MAT_DIALOG_DATA } from '@angular/material';
import $ from 'jquery';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

//import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message, DrawImg, UploadFile, UploadImg } from './shared/model/message';
//import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';

import { DrawboardComponent } from '../drawboard/drawboard.component';
import { PreviewImgComponent } from '../preview-img/preview-img.component';
import { HttpResponse } from '@angular/common/http';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';
//const upload_URL ='http://localhost:8080/api/upload-file';
const upload_URL =appConfig.apiUrl+'/api/upload-file';

import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';
import { appConfig } from '../app.config';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  imgUrl: string;
imageData;
  drawboard=false;
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

@Input() emoji=null;
@Input() emoji_status=false;
@ViewChild('inputMessage') private input;
@ViewChild('upload_input') input_file: ElementRef;
@ViewChild('upload_image') input_img: ElementRef;



selectedFile: File = null;
uploadedPercentage = 0;
showMessage = false;
upload_message: String = '';
showProgressBar = false;
selectedImg: File = null;

currentUser: User;
users: User[] = [];

showChatPage=true;
searchUsers :User[]=[];
searchText:string='';

showSpinner :boolean =true;



//@ViewChild('scrollMe') private myScrollContainer: ElementRef;



  // getting a reference to the overall list, which is the parent container of the list items
  //@ViewChildren('scrollMe') private myScrollContainer: ElementRef;

  // getting a reference to the items/messages within the list

  constructor(private socketService: SocketService,

    public dialog: MatDialog,private http: HttpClient,private userService: UserService) {this.currentUser = JSON.parse(localStorage.getItem('currentUser')); console.log(this.currentUser);this.loadAllUsers(); }

  ngOnInit(): void {

    console.log(localStorage.currentUser);
    //this.username= window.prompt('Enter Your Name');
    //console.log(this.messages);

    console.log("drawZone", this.drawWidth,this.drawHeight);

    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      //this.openUserPopup(this.defaultDialogUserParams);
      this.initIoConnection();
    }, 100);

    $(document).ready(function(){
      var box = document.querySelector('drawZone');
      var width = $( window ).width();
      //var width = $('drawZone').width();
      console.log("width",width);
      //$('body').bind('touchmove', function(e){e.preventDefault()});
    });


  }

  draw() {
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
    this.updateSelectedUser();
    user.unreadCount=0;
    this.socketService.updateUnreadMsg(
      {selectedUserName:user.username,
      currentUserName:this.currentUser.username,
      createdAt: new Date()
    });
    console.log(user);


  }

  private loadOnlineUser(allUsers,userList){
      console.log("userlist",userList);
      console.log("alllist",allUsers);

    for(var i=0;i<allUsers.length;i++){
      var found =false;
      for(var j=0;j<userList.length;j++){
        if(allUsers[i].username==userList[j].username){
          //allUsers[i].channelid=userList[j].channelid;
          console.log("true");

          allUsers[i].online = true;
          found =true;
        }
      }
      if(found==false){
        allUsers[i].online =false;
        //allUsers[i].channelid='';
      }
    }
  }


  private initIoConnection(): void {

    this.socketService.initSocket();
    this.socketService.init(this.currentUser);
    //console.log("emit ", this.username);
    this.ioConnection = this.socketService.socket.on('userList',(userList,channelid) => {
      if(this.socketId === null){
          this.socketId = channelid;
      }
      this.userList = userList;
      this.getselfsockets();
      this.updateSelectedUser();
      //this.loadAllUsers();
      setTimeout(() => {
      this.loadOnlineUser(this.users,this.userList);
    }, 1000);

      //console.log(userList);
      //console.log("userList",this.userList);
      //console.log("socketId",this.socketId);
  });

  this.ioConnection = this.socketService.onMessage()
    .subscribe((message: Message) => {
      this.messages.push(message);
      this.loadNewMsg();
      this.countInComingMsg(message);
      console.log(message);

    });

  this.ioConnection = this.socketService.socket.on('exit', (userList) => {
    this.userList = userList;
    this.getselfsockets();
    this.updateSelectedUser();
    //this.loadAllUsers();
    setTimeout(() => {
    this.loadOnlineUser(this.users,this.userList);
  }, 1000);

  });

  this.ioConnection = this.socketService.onDrawImg()
    .subscribe((img: DrawImg) => {
      this.messages.push(img);
      this.loadNewMsg();
      this.countInComingMsg(img);


      console.log("receive draw:");
    });

    this.ioConnection = this.socketService.onFile()
      .subscribe((file: UploadFile) => {
        this.messages.push(file);
        this.loadNewMsg();
        this.countInComingMsg(file);


        console.log("receive file:",file);

      });

      this.ioConnection = this.socketService.onImg()
        .subscribe((file: UploadImg) => {
          this.messages.push(file);
          this.loadNewMsg();
          this.countInComingMsg(file);


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
        this.loadNewMsg();
        this.countUnreadHistory(this.messages);
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
          senderName : this.currentUser.username,
          receiverName : this.selectedUser.username,
          //createAt: Date.now(),
          selfsockets: this.selfsockets,
          createdAt: new Date()
    });


    this.messageContent = null;
  }

  getselfsockets(){
    for(var i =0; i<this.userList.length;i++){
      if(this.userList[i].username==this.currentUser.username){
        this.selfsockets =this.userList[i].channelid;
      }
    }
    console.log("selfsockets",this.selfsockets);

  }

  updateSelectedUser(){
    if(this.selectedUser){
      for(var i =0; i<this.userList.length;i++){
        if(this.userList[i].username==this.selectedUser.username){
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
        senderName : this.currentUser.username,
        receiverName : this.selectedUser.username,
        //createAt: Date.now(),
        selfsockets: this.selfsockets,
        createdAt: new Date()

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
        senderName : this.currentUser.username,
        receiverName : this.selectedUser.username,
        //createAt: Date.now(),
        selfsockets: this.selfsockets,
        createdAt: new Date()

  });
}
public sendImg(path: string, name: string): void {
  if (!path) {
    return;
  }
  this.socketService.sendImg({
        fromid: this.socketId,
          toid : this.selectedUser.channelid,
        //msg : message,
        imgname: name,
        img :path,
        senderName : this.currentUser.username,
        receiverName : this.selectedUser.username,
        //createAt: Date.now(),
        selfsockets: this.selfsockets,
        createdAt: new Date()

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
    this.selectedImg=null;
    this.input_img.nativeElement.value=null;
    console.log(this.selectedFile);
  }
  onImgSelected(event) {
    var reader = new FileReader();
    this.selectedFile=null;
    this.input_file.nativeElement.value=null;

    this.selectedImg = <File>event.target.files[0];
    reader.onload = e => this.imgUrl = reader.result;

        reader.readAsDataURL(this.selectedImg);


    console.log(event);
  }

  onUpload(type) {
    const fd = new FormData();
    this.showMessage = false;
    if(type=='file'){
      fd.append('file', this.selectedFile, this.selectedFile.name);
    }
    if(type =='img'){
      fd.append('file', this.selectedImg, this.selectedImg.name);
    }
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
            if(type=='file'){ this.sendFile(file_path,file_name);
}
            if(type =='img'){
              console.log("sendimg")
            this.sendImg(file_path,file_name);
          }


            //console.log(file_path);
          }
          this.showProgressBar=false;
          this.uploadedPercentage=0;
          break;
        case 1: {
          if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)){
            this.uploadedPercentage = event['loaded'] / event['total'] * 100;
            this.selectedFile = null;
            this.selectedImg = null;
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

  clickImgUploader(){
    this.input_img.nativeElement.click();
  }

  private loadAllUsers() {
      this.userService.getAll().pipe(first()).subscribe(users => {
          this.users = users;
          console.log(this.messages);
          this.users.forEach(x=>{x.online=false,x.newestMsg='',x.unreadCount=0});
          console.log(this.users);
          for(var i=0; i<this.users.length;i++){
            if(this.users[i].username===this.currentUser.username){
              this.users.splice(i,1);
            }
          }
          this.searchUsers = this.users;
          console.log(this.searchUsers);
this.showSpinner=false
      });


  }


  disconnect(){
    console.log("disconnect");
    this.ioConnection=this.socketService.socket.close();
  }

  input_file_reset(){
    this.selectedFile=null;
    this.selectedImg =null;
    //console.log(this.input_file);
    this.input_file.nativeElement.value=null;
    this.input_img.nativeElement.value=null;
  }

  loadNewMsg(){
    for(var j=0;j<this.users.length;j++){

      for(var i=0;i<this.messages.length;i++){
        if(this.messages[i].senderName==this.users[j].username || this.messages[i].receiverName==this.users[j].username){
          //var date = new Date(this.messages[i].createdAt);
          //this.messages[i].createdAt = this.renderDate(date);
          this.users[j].newestMsg=this.messages[i];
        }
      }
    }
    console.log(this.users);
  }

countInComingMsg(msg){
  console.log(msg);
  for(var j=0;j<this.users.length;j++){
    if(msg.senderName==this.users[j].username){
      this.users[j].unreadCount++;
    }
}
}

countUnreadHistory(msgList){
  for(var j=0;j<this.users.length;j++){
    for(var i=0;i<msgList.length;i++){
      if(msgList[i].read==false && msgList[i].senderName==this.users[j].username){
        this.users[j].unreadCount++;
      }
    }

}
}

showSearchUser(key){
  const result = this.users.filter(user => user.username.toLowerCase().includes(key.toLowerCase()));
  this.searchUsers = result;
}

renderDate(date:Date) {
  date = new Date(date);
  const today = new Date
  const yesterday = new Date; yesterday.setDate(today.getDate() - 1)
  if(date.toLocaleDateString() == today.toLocaleDateString()){
    return this.formatDate(date,false);
  }else if (date.toLocaleDateString() == yesterday.toLocaleDateString()) {
    return 'Yesterday'
  }
  return this.formatDate(date,true);
}

formatDate(date,display_date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  if(display_date==false){  return strTime;
}
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();


}

}
