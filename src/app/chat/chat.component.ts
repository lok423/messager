import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, AfterViewChecked, AfterContentChecked,AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem,MAT_DIALOG_DATA } from '@angular/material';
import $ from 'jquery';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

//import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message, DrawImg, UploadFile } from './shared/model/message';
//import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';

import { PreviewImgComponent } from '../preview-img/preview-img.component';
import { HttpResponse } from '@angular/common/http';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';
//const upload_URL ='http://localhost:8080/api/upload-file';
const upload_URL ='http://192.168.1.76:8080/api/upload-file';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


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
  allUsersList = [{channelid: '', userName: "mark",online:false},

{channelid: '',userName: "dean",online:false},

{channelid: '',userName: "peter",online:false},

{channelid: '',userName: "bill",online:false},

{channelid: '',userName: "mike",online:false},

{channelid: '',userName: "ken",online:false}];
emoji=null;
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


  draw(drawboard) {
    if(drawboard ==true){
      this.drawboard=false;
    }else{
      this.drawboard=true;
    }
  }

  closeDrawboard(event){
    this.drawboard=false;
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
      console.log("userList",this.userList);
      console.log("socketId",this.socketId);
  });

  this.ioConnection = this.socketService.onMessage()
    .subscribe((message: Message) => {
      this.messages.push(message);
      console.log(message);
      //this.scrollToBottom();

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
      //this.scrollToBottom();
    });

    this.ioConnection = this.socketService.onFile()
      .subscribe((file: UploadFile) => {
        this.messages.push(file);
        console.log("receive file:",file);
        //this.scrollToBottom();

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

  arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

/*
uploadFile($event: any){
  var fileUpload = this.input_file.nativeElement;
  var files = fileUpload.files[0];
  console.log("file",files);

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = percentComplete * 100;

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }
          }
        }, false);
        return xhr;
      }
    });
    }
  }
  */

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
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
}
