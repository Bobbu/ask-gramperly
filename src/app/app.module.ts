import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AskGramperlyComponent } from './ask-gramperly/ask-gramperly.component';

@NgModule({
  declarations: [
    AppComponent,
    AskGramperlyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
