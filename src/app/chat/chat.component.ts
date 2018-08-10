import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, AfterViewChecked, AfterContentChecked,AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem,MAT_DIALOG_DATA } from '@angular/material';



//import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message, DrawImg } from './shared/model/message';
//import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';

import { PreviewImgComponent } from '../preview-img/preview-img.component';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {



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
//@ViewChild('scrollMe') private myScrollContainer: ElementRef;



  // getting a reference to the overall list, which is the parent container of the list items
  //@ViewChildren('scrollMe') private myScrollContainer: ElementRef;

  // getting a reference to the items/messages within the list

  constructor(private socketService: SocketService,

    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.username= window.prompt('Enter Your Name');
    console.log(this.messages);

    console.log("drawZone", this.drawWidth,this.drawHeight);


    //this.scrollToBottom();

    //this.initModel();
    this.initIoConnection();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      //this.openUserPopup(this.defaultDialogUserParams);
    }, 0);

  }


  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
/*
  private scrollToBottom(): void {
    try {
      var height = document.getElementById('scrollMe').scrollHeight+72;
      //var height = this.scrollMe.nativeElement.scrollHeight;
      //let scroll =this.scrollMe.nativeElement.scrollTop;
      //scroll = height;
      document.getElementById('scrollMe').scrollTop = height;
    } catch (err) {
      console.log(err);
      console.log("scroll",this.scrollMe);

    }
  }

  scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) {
console.log(this.myScrollContainer);
        }
    }
    */

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
      console.log("receive draw:",img);
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

previewImg(img){
  console.log(img);
  const dialogRef = this.dialog.open(PreviewImgComponent, {

    data: { img }
  });
}


}
