import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AdminAuthGuard } from '../admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'add-edit-user',
    component: AddUserComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
