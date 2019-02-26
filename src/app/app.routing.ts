import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './_helpers/auth.guard.service';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
const appRoutes: Routes = [
    { path: 'menu', component: MenuComponent, children: [
    ], canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },

    // otherwise redirect to menu
    { path: '**', redirectTo: 'menu' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
