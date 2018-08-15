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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
<<<<<<< HEAD
import { UploaderComponent } from './uploader/uploader.component';
=======
import { DashboardComponent } from './dashboard/dashboard.component';
>>>>>>> d457f6e4d35b000b0a6a5d7cfa04d57aa0157027

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
  DrawboardComponent,
    PreviewImgComponent,
<<<<<<< HEAD
    UploaderComponent
=======
    DashboardComponent
>>>>>>> d457f6e4d35b000b0a6a5d7cfa04d57aa0157027
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
<<<<<<< HEAD
    HttpClientModule
=======
    NgbModule
>>>>>>> d457f6e4d35b000b0a6a5d7cfa04d57aa0157027
  ],
  providers: [SocketService],
  bootstrap: [AppComponent],
  entryComponents: [PreviewImgComponent, DrawboardComponent]//,
  //exports: [DrawboardComponent]
})
export class AppModule { }
