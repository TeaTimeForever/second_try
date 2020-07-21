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
import { ParticipantRowComponent } from './participants/participant-row/participant-row.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginOptionsDialogComponent } from './login-options-dialog/login-options-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StageResultsComponent } from './stage-results/stage-results.component';

@NgModule({
  declarations: [
    AppComponent,
    StageComponent,
    ParticipantsComponent,
    UserProfileComponent,
    NoActiveStageComponent,
    RegulationsComponent,
    PrivacyComponent,
    TermsOfServcieComponent,
    ParticipantRowComponent,
    LoginOptionsDialogComponent,
    StageResultsComponent
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
    NoopAnimationsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoginOptionsDialogComponent]
})
export class AppModule { }
