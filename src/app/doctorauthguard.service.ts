import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { DocauthService } from './docauth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DoctorauthguardService implements CanActivate {

  constructor(private docauthService:DocauthService,private router:Router) { }
  canActivate() {
      if(this.docauthService.isUserLoggedIn()){
        return true;
      }
      else {
        this.router.navigate(['doclogin'])
        return false;
      }
  }
}
