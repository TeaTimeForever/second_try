import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { StageComponent } from './stage/stage.component';
import { ParticipantsComponent } from './participants/participants.component';
import { environment } from 'src/environments/environment';
import { JoinComponent } from './join/join.component';
import { RehulationsComponent } from './rehulations/rehulations.component';
import { RegulationsComponent } from './regulations/regulations.component';

@NgModule({
  declarations: [
    AppComponent,
    StageComponent,
    ParticipantsComponent,
    JoinComponent,
    RehulationsComponent,
    RegulationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
