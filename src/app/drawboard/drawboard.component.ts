import {
  Component, Input, ElementRef, AfterViewInit, ViewChild, Output,EventEmitter
} from '@angular/core';
import { Observable,fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';
import $ from 'jquery';

//import 'rxjs/add/observable/fromEvent';
//import 'rxjs/add/operator/takeUntil';
//import 'rxjs/add/operator/pairwise';
//import 'rxjs/add/operator/switchMap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { pairwise } from 'rxjs/internal/operators/pairwise';

@Component({
  selector: 'app-drawboard',
  templateUrl: './drawboard.component.html',
  styleUrls: ['./drawboard.component.css']
})
export class DrawboardComponent implements AfterViewInit {

  @Output() drawOutput: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 800;
  @Input() public height = 400;
  font = ['small', 'medium', 'large'];
  imgageSrc;
  colorCode = '#000';

  @Output() drawboard: EventEmitter<any> = new EventEmitter<any>();

  private cx: CanvasRenderingContext2D;
  color = [
    'black',
    'red',
    'blue',
    'green',
  ];

  constructor() { }

  // constructor(width: number, height: number) {
  //   this.width = width;
  //   this.height = height;
  // }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

      canvasEl.width = this.width;
      canvasEl.height = this.height;

      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = this.colorCode;

      this.captureEvents(canvasEl);
      this.touchcaptureEvents(canvasEl);

      // Prevent scrolling when touching the canvas
      document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvasEl) {

          //if (e.cancelable) {
            //console.log("touch");
        // 判断默认行为是否已经被禁用
        //if (!e.defaultPrevented) {
            //e.preventDefault();
            $('body').addClass('stop-scrolling');
            console.log("add class")
            //$('body').bind('touchmove', function(e){e.preventDefault()})
        //}
    //}
        }
      }, false);
      document.body.addEventListener("touchend", function (e) {
        if (e.target != canvasEl) {
          //if (e.cancelable) {
        // 判断默认行为是否已经被禁用
      //  if (!e.defaultPrevented) {
            //e.preventDefault();
      //  }

    //}
    //$('body').removeClass('stop-scrolling');
    $(document).ready(function(){
      $('body').removeClass('stop-scrolling');
      console.log("remove class");
      //$('body').bind('touchmove', function(e){e.preventDefault()});
    });

        }
      }, false);
      document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvasEl) {
          //console.log("touchmove",e);


$(document).ready(function(){
  $('body').addClass('stop-scrolling');
  console.log("add class");
  //$('body').bind('touchmove', function(e){e.preventDefault()});
});
          //if (e.cancelable) {

        // 判断默认行为是否已经被禁用
        //if (!e.defaultPrevented) {
            //e.preventDefault();
          //  var s =this.disableScroll();
        //}
    //}

  }else{
    $(document).ready(function(){
      $('body').removeClass('stop-scrolling');
      console.log("remove class");
      //$('body').bind('touchmove', function(e){e.preventDefault()});
    });
  }

      }, false);
      //$('body').unbind('touchmove');

        $('body').removeClass('stop-scrolling');



    }

    disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', this.preventDefault, false);
  window.onwheel = this.preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
  window.ontouchmove  = this.preventDefault; // mobile
  //document.onkeydown  = preventDefaultForScrollKeys;
}

preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

    private captureEvents(canvasEl: HTMLCanvasElement) {
      const obsMouseDown = fromEvent(canvasEl, 'mousedown').pipe(
        switchMap((e) => {
            return fromEvent(canvasEl, 'mousemove').pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              pairwise()
            );
        }))

        .subscribe((res: [MouseEvent, MouseEvent]) => {
          console.log("res",res[0],res[1]);
          const rect = canvasEl.getBoundingClientRect();
          // console.log(' res[0]', res[0]);

          const prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
          };

          const currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
          };

          this.drawOnCanvas(prevPos, currentPos);
        });
    }

    private touchcaptureEvents(canvasEl: HTMLCanvasElement) {
      const obsMouseDown = fromEvent(canvasEl, 'touchstart').pipe(
        switchMap((e) => {
          e.preventDefault();
            return fromEvent(canvasEl, 'touchmove').pipe(
              takeUntil(fromEvent(canvasEl, 'touchend')),
              pairwise()
            );
        }))

        .subscribe((res: [TouchEvent, TouchEvent]) => {
          const rect = canvasEl.getBoundingClientRect();
          // console.log(' res[0]', res[0]);

          const prevPos = {
            x: res[0].touches[0].clientX - rect.left,
            y: res[0].touches[0].clientY - rect.top
          };

          const currentPos = {
            x: res[1].touches[0].clientX - rect.left,
            y: res[1].touches[0].clientY - rect.top
          };

          this.drawOnCanvas(prevPos, currentPos);
        });
    }



    private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
      if (!this.cx) { return; }

      this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
  onDrawImage(event) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.imgageSrc = canvasEl.toDataURL();
    // console.log('dataurl', this.imgageSrc);
    this.drawOutput.emit(this.imgageSrc);
    this.cx.clearRect(0, 0, this.width, this.height);
    document.getElementById('drawboard').style.display = 'none';
  }

  closeDrowWin() {
    this.drawboard.emit(false);
  }
  onSelectFont(item) {
    if (item === 'small') {
      this.cx.lineWidth = 1;
    }
    if (item === 'medium') {
      this.cx.lineWidth = 3;
    }
    if (item === 'large') {
      this.cx.lineWidth = 10;
    }

  }
  onSelectColor(item) {
    this.colorCode = item;
    this.cx.strokeStyle = this.colorCode;
  }
  onEraseDraw(event) {
    this.cx.strokeStyle = 'white';
  }
  onClearDraw(event) {

      this.cx.clearRect(0, 0, this.width, this.height);
    }
    onPencilColor(event) {

      this.cx.strokeStyle = this.colorCode;
    }

}
