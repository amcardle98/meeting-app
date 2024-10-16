import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { CreateComponent } from './views/create/create.component';
import { JoinComponent } from './views/join/join.component';
import { EventComponent } from './views/event/event.component';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DatePickerComponent,
    CreateComponent,
    JoinComponent,
    EventComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
