import { Component, OnInit,ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import * as $ from 'Jquery';
import {MatMenuTrigger} from '@angular/material';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {ChatComponent} from '../chat/chat.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [NgbDropdownConfig] 
})
export class DashboardComponent implements OnInit, AfterViewChecked{
  name = "bill";
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(config: NgbDropdownConfig) { 
    config.placement = 'top-right';
    config.autoClose = false;
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();      
  }

  openMyMenu() {
    this.trigger.openMenu();
  } 
  closeMyMenu() {
    this.trigger.closeMenu();
  }  

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}
}
