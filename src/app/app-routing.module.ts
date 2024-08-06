import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { JoinComponent } from './views/join/join.component';
import { CreateComponent } from './views/create/create.component';
import { animation } from '@angular/animations';

/**
 * TODO: Add animations to routes
 * 
 * @see https://angular.dev/guide/animations/route-animations
 * 
 * @example { path: 'join', component: JoinComponent, data: { animation: 'JoinPage' } }
 */

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'join', component: JoinComponent },
  { path: 'create', component: CreateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
