import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocauthService {

  constructor() { }

  authenticate(username:string,password:string){
    if(username=="gaurav"&&password=="root"){
      sessionStorage.setItem('username',username);
      return true;
    } else{
      return false;
    }
  }
  isUserLoggedIn(){
    console.log("login ho gya")
    let user = sessionStorage.getItem('username');
    return !(user==null)
  }
  logout(){
    console.log("logout ho gya")
    sessionStorage.removeItem('username');
  }
}
