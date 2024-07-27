import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminauthService {

  constructor() { }

  authenticate(username:string,password:string){
    if(username=='gaurav' && password=='root'){
      sessionStorage.setItem('username',username);
      return true
    }
    else{
      return false
    }
  }

  isUserLoggedIn(){
    console.log("user login ho gya hai")
    let user=sessionStorage.getItem('username');
    
    return !(user==null)
  }
  logout(){
    console.log("logout")
    sessionStorage.removeItem('username');
  }
}
