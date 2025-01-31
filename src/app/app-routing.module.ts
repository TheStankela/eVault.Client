import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: '', redirectTo: 'home', pathMatch: 'full' 
  },
  { 
    path: 'login', component: LoginComponent 
  },
  { 
    path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  { 
    path: '**', redirectTo: 'home', pathMatch: 'full'
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
