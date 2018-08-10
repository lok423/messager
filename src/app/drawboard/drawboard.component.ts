import {
  Component, Input, ElementRef, AfterViewInit, ViewChild, Output,EventEmitter
} from '@angular/core';
import { Observable,fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';


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

    @Input() public width ;
    //this.drawHeight = document.getElementById('drawZone').clientHeight;;
    @Input() public height;
    font = [1, 2, 3, 4, 5, 8, 9, 10];
    imgageSrc;
    colorCode = '#000';

    private cx: CanvasRenderingContext2D;
    color = [
      '#f0f8ff',
      '#faebd7',
      '#00ffff',
      '#7fffd4',
      '#f0ffff',
      '#f5f5dc',
      '#ffe4c4',
      '#000000',
      '#ffebcd',
      '#0000ff',
      '#8a2be2',
      '#a52a2a',
      '#deb887',
      '#5f9ea0',
      '#7fff00',
      '#d2691e',
      '#ff7f50',
      '#6495ed',
      '#fff8dc',
      '#dc143c',
      '#00ffff',
      '#00008b',
      '#008b8b',
      '#b8860b',
      '#a9a9a9',
      '#006400',
      '#a9a9a9',
      '#bdb76b',
      '#8b008b',
      '#556b2f',
      '#ff8c00',
      '#9932cc',
      '#8b0000',
      '#e9967a',
      '#8fbc8f',
      '#483d8b',
      '#2f4f4f',
      '#2f4f4f',
      '#00ced1',
      '#9400d3',
      '#ff1493',
      '#00bfff',
      '#696969',
      '#696969',
      '#1e90ff',
      '#b22222',
      '#fffaf0',
      '#228b22',
      '#ff00ff',
      '#dcdcdc',
      '#f8f8ff',
      '#ffd700',
      '#daa520',
      '#808080',
      '#008000',
      '#adff2f',
      '#808080',
      '#f0fff0',
      '#ff69b4',
      '#cd5c5c',
      '#4b0082',
      '#fffff0',
      '#f0e68c',
      '#e6e6fa',
      '#fff0f5',
      '#7cfc00',
      '#fffacd',
      '#add8e6',
      '#f08080',
      '#e0ffff',
      '#fafad2',
      '#d3d3d3',
      '#90ee90',
      '#d3d3d3',
      '#ffb6c1',
      '#ffa07a',
      '#20b2aa',
      '#87cefa',
      '#778899',
      '#778899',
      '#b0c4de',
      '#ffffe0',
      '#00ff00',
      '#32cd32',
      '#faf0e6',
      '#ff00ff',
      '#800000',
      '#66cdaa',
      '#0000cd',
      '#ba55d3',
      '#9370db',
      '#3cb371',
      '#7b68ee',
      '#00fa9a',
      '#48d1cc',
      '#c71585',
      '#191970',
      '#f5fffa',
      '#ffe4e1',
      '#ffe4b5',
      '#ffdead',
      '#000080',
      '#fdf5e6',
      '#808000',
      '#6b8e23',
      '#ffa500',
      '#ff4500',
      '#da70d6',
      '#eee8aa',
      '#98fb98',
      '#afeeee',
      '#db7093',
      '#ffefd5',
      '#ffdab9',
      '#cd853f',
      '#ffc0cb',
      '#dda0dd',
      '#b0e0e6',
      '#800080',
      '#663399',
      '#ff0000',
      '#bc8f8f',
      '#4169e1',
      '#8b4513',
      '#fa8072',
      '#f4a460',
      '#2e8b57',
      '#fff5ee',
      '#a0522d',
      '#c0c0c0',
      '#87ceeb',
      '#6a5acd',
      '#708090',
      '#708090',
      '#fffafa',
      '#00ff7f',
      '#4682b4',
      '#d2b48c',
      '#008080',
      '#d8bfd8',
      '#ff6347',
      '#40e0d0',
      '#ee82ee',
      '#f5deb3',
      '#ffffff',
      '#f5f5f5',
      '#ffff00',
      '#9acd32'];
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

          if (e.cancelable) {
            //console.log("touch");
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
        }
      }, false);
      document.body.addEventListener("touchend", function (e) {
        if (e.target == canvasEl) {
          if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
        }
      }, false);
      document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvasEl) {
          //console.log("touchmove",e);

          if (e.cancelable) {

        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
        }
      }, false);


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
       //console.log('dataurl', this.imgageSrc);
       this.drawOutput.emit(this.imgageSrc);
       this.cx.clearRect(0, 0, this.width, this.height);
    }
    onSelectFont(item) {
      this.cx.lineWidth = item;
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
