import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { AppComponent } from "./app.component";
import { StageComponent } from "./stage/stage.component";
import { ParticipantsComponent } from "./participants/participants.component";
import { environment } from "src/environments/environment";
import { UserProfileComponent } from "./userProfile/userProfile.component";
import { NoActiveStageComponent } from './stage/no-active-stage/no-active-stage.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsOfServcieComponent } from './terms-of-servcie/terms-of-servcie.component';

@NgModule({
  declarations: [
    AppComponent,
    StageComponent,
    ParticipantsComponent,
    UserProfileComponent,
    NoActiveStageComponent,
    RegulationsComponent,
    PrivacyComponent,
    TermsOfServcieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
