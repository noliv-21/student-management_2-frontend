import { Routes } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AuthGuard, AdminGuard, LoginPageGuard} from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',component:LoginSignupComponent,canActivate: [LoginPageGuard]
    },
    {
        path:'user-home',component:UserHomeComponent,canActivate:[AuthGuard]
    },
    {
        path:'admin-home',component:AdminHomeComponent,canActivate:[AuthGuard,AdminGuard]
    },
    {
        path:'',redirectTo:'/login',pathMatch:'full'
    },
];
