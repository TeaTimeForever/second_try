import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './stage/stage.component';


const routes: Routes = [
  {path: '', component: StageComponent},
  {path: 'stage/:id', component: StageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
