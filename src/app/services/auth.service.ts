import { Injectable, OnInit } from '@angular/core';
import { Settings } from '../../settings';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { TokenDto } from '../models/tokenModel';
import { BehaviorSubject, map } from 'rxjs';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit{

  public currentUser: User = new User();

  public isLoggedIn = new BehaviorSubject<boolean>(false);

  baseURL = Settings.ApiUrl;

  constructor(private http: HttpClient, private router: Router, private toasterService: ToasterService) {
  }

  ngOnInit(): void {
    this.setIsLoggedIn(this.getIsLoggedIn());
  }

  login(loginObj : any){
    return this.http.post<any>(`${this.baseURL}/login`, loginObj)
      .pipe(map(res => {
        this.storeTokens(res.accessToken, res.refreshToken);

        this.setIsLoggedIn(this.getIsLoggedIn());

        return res;
      }));
  }

  getCurrentUser(){
    return this.http.get<User>(`${this.baseURL}/api/user/current`)
    .pipe(map(res => {
      this.currentUser = res;

      if(res){
        this.setIsLoggedIn(true);
      }

      return res;
    }));
  }

  refreshToken(apiToken : TokenDto){
    return this.http.post<any>(`${this.baseURL}/refresh`, apiToken);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.setIsLoggedIn(false);

    this.toasterService.success('Logout successfull!')

    this.router.navigate(['login'])
  }

  storeTokens(token: string, refreshToken: string){
    this.storeToken(token);
    this.storeRefreshToken(refreshToken);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  setIsLoggedIn(isLoggedIn: boolean){
    this.isLoggedIn.next(isLoggedIn);
  }
  
  getIsLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }
}
