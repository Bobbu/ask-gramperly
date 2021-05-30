import { AskGramperlyComponent } from './ask-gramperly/ask-gramperly.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: AskGramperlyComponent },
  { path: '**', component: AskGramperlyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
