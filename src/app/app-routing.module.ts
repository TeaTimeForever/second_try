import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { StageComponent } from './stage/stage.component';
import { ParticipantsComponent } from './participants/participants.component';
import { UserProfileComponent } from './userProfile/userProfile.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { RedirectToActiveStageGuard } from './redirect-to-active-stage.guard';
import { NoActiveStageComponent } from './stage/no-active-stage/no-active-stage.component';
import { map } from 'rxjs/operators';
import { User } from 'firebase/app';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsOfServcieComponent } from './terms-of-servcie/terms-of-servcie.component';
import { StageResultsComponent } from './stage-results/stage-results.component';

const mustBeLoggedIn = () => map((user: User) => Boolean(user) || ['/'])

const routes: Routes = [
  { path: '', canActivate: [RedirectToActiveStageGuard], component: NoActiveStageComponent },
  {
    path: 'stage/:year/:id', component: StageComponent, children: [
      {path: 'participants', component: ParticipantsComponent},
      {path: 'results', component: StageResultsComponent},
    ]
  },
  { path: 'regulations', component: RegulationsComponent },
  { path: 'privacypolicy', component: PrivacyComponent },
  { path: 'termsofservice', component: TermsOfServcieComponent },
  { path: 'personal', component: UserProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: mustBeLoggedIn } }
];

@NgModule({
  imports: [
    AngularFireAuthGuardModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
