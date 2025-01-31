import { Injectable, OnInit } from '@angular/core';
import { Settings } from '../../settings';
import { HttpClient, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { TokenDto } from '../models/tokenModel';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { ToasterService } from './toaster.service';
import { BaseService } from './base.service';
import { Result } from '../common/result';
import { AuthMessages, HubResources } from '../common/constants';
import { SignalRService } from './signalr.service';
import { HubConnectionState } from '@microsoft/signalr';
import { Connect } from 'vite';
import { Connection } from '../models/connection';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService implements OnInit{

  public currentUser: User = new User();

  public isLoggedIn = new BehaviorSubject<boolean>(false);

  baseURL = Settings.ApiUrl;

  constructor(private http: HttpClient, private router: Router, private signalRService: SignalRService, toasterService: ToasterService) {
    super(toasterService);

    if (this.getIsLoggedIn()) {
        if (this.signalRService.hubConnection?.state == HubConnectionState.Connected) {
          this.onReAuthenticate();
          this.reAuthenticate();
        }
        else {
          this.signalRService.stateAsObservable().subscribe((obj: any) => {
              if (obj.type == HubResources.HubConnectionStartedState) {
                this.onReAuthenticate();
                this.reAuthenticate();
              }
          });
        }
    }
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

  getCurrentUser() {
    return this.http.get<Result<User>>(`${this.baseURL}/api/user/current`)
      .pipe(
        map(res => {
          if (res.statusCode === HttpStatusCode.Ok) {
            this.currentUser = res.data;

            this.setIsLoggedIn(true);
            }
          return res;
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(apiToken : TokenDto){
    return this.http.post<any>(`${this.baseURL}/refresh`, apiToken);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.setIsLoggedIn(false);

    this.toasterService.success(AuthMessages.LogoutSuccess)

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

  //SignalR
  reAuthenticate() {
    this.signalRService.hubConnection.invoke("ReAuthenticate",)
    .catch(err => console.error(err));
  }

  onReAuthenticate() {
    this.signalRService.hubConnection.on("ReAuthenticate", (connection: Connection) => {
      this.signalRService.currentConnectionData = connection;
    });
  }
}
