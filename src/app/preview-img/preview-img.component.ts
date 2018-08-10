import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-preview-img',
  templateUrl: './preview-img.component.html',
  styleUrls: ['./preview-img.component.css']
})
export class PreviewImgComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    console.log(data);
  }

  ngOnInit() {
  }

}
