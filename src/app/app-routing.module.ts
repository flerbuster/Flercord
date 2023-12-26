import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlercordComponent } from './flercord/flercord.component';

const routes: Routes = [
  { title: 'flercord', path: '', component: FlercordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
