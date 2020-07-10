import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './stage/stage.component';
import { ParticipantsComponent } from './participants/participants.component';
import { JoinComponent } from './join/join.component';


const routes: Routes = [
  {path: '', component: StageComponent},
  {path: 'stage/:year/:id', component: StageComponent, children: [
    {path: 'participants', component: ParticipantsComponent, children: [
      {path: 'join', component: JoinComponent}
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
