import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './user/profile/profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';

/* Custom services */
import { UserService } from './services/users/user.service';
import { ProjectService } from './services/projects/project.service';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';

const appRoutes: Routes = [
{ path: '', component: LoginComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'forgot-password', component: ForgotPasswordComponent },
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'user/profile', component: ProfileComponent, canActivate: [AuthGuard]},
{ path: 'user/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
{ path: 'dashboard/projects', component: ProjectListComponent, canActivate: [AuthGuard] },
{ path: 'dashboard/projects', component: ProjectListComponent, canActivate: [AuthGuard] },
{ path: 'dashboard/project/new', component: AddProjectComponent, canActivate: [AuthGuard] },
{ path: 'dashboard/project/edit/:handle', component: EditProjectComponent, canActivate: [AuthGuard] },
{ path: '**', redirectTo: 'login' }
];

@NgModule({
    declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProjectListComponent,
    DashboardComponent,
    NavbarComponent,
    ProfileComponent,
    AddProjectComponent,
    ChangePasswordComponent,
    EditProjectComponent
    ],
    imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        maxOpened: 1,
        preventDuplicates:true
    }),
    RouterModule.forRoot(appRoutes),
    ],
    providers: [
    UserService,
    ProjectService,
    AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
