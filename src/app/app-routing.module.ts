import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './stage/stage.component';
import { ParticipantsComponent } from './participants/participants.component';
import { JoinComponent } from './join/join.component';
import { RedirectToActiveStageGuard } from './redirect-to-active-stage.guard';
import { NoActiveStageComponent } from './stage/no-active-stage/no-active-stage.component';


const routes: Routes = [
  { path: '', canActivate: [RedirectToActiveStageGuard], component: NoActiveStageComponent },
  {
    path: 'stage/:year/:id', component: StageComponent, children: [
      {
        path: 'participants', component: ParticipantsComponent, children: [
          { path: 'join', component: JoinComponent }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
