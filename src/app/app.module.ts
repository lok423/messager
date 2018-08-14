import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { DrawboardComponent } from './drawboard/drawboard.component';
import { PreviewImgComponent } from './preview-img/preview-img.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MaterialModule } from './shared/material/material.module';

import { SocketService } from './chat/shared/services/socket.service';


import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import {
  MatAutocompleteModule,

  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { UploaderComponent } from './uploader/uploader.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
  DrawboardComponent,
    PreviewImgComponent,
    UploaderComponent
  ],
  imports: [

    BrowserModule,
    MatAutocompleteModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PickerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent],
  entryComponents: [PreviewImgComponent]//,
  //exports: [DrawboardComponent]
})
export class AppModule { }
