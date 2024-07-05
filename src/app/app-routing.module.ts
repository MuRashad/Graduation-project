import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SearchComponent } from './search/search.component';
import { MedicinesComponent } from './medicines/medicines.component';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';
import { CanActivateFn } from '@angular/router';
import { authGuardGuard } from './auth-guard.guard';
//#regio

const routes: Routes = [
  { path: "", redirectTo: "signup", pathMatch: "full" },
  { path: "home",canActivate:[authGuardGuard], component: HomeComponent, title: "Home" },
  { path: "chatbot",canActivate:[authGuardGuard], component: ChatbotComponent, title: "Chat" },
  { path: "signup", component: SignupComponent, title: "Register" },
  { path: "login", component: LoginComponent, title: "login" },
  { path: "search",canActivate:[authGuardGuard], component: SearchComponent, title: "search" },
  { path: 'medicines',canActivate:[authGuardGuard], component: MedicinesComponent },
  { path: 'medicine/:id', canActivate:[authGuardGuard], component: MedicineDetailsComponent },
  { path: "**", component: NotfoundComponent, title: "error" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
