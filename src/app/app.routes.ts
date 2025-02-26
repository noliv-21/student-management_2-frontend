import { Routes } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

export const routes: Routes = [
    {
        path: 'login',component:LoginSignupComponent
    },
    {
        path:'user-home',component:UserHomeComponent
    },
    {
        path:'admin-home',component:AdminHomeComponent
    },
    {
        path:'',redirectTo:'/login',pathMatch:'full'
    }
];
