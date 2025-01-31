import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToasterService } from './toaster.service';
import { Settings } from '../../settings';
import { HubResources } from '../common/constants';
import { AuthService } from './auth.service';
import { Connection } from '../models/connection';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  
  hubConnection:signalR.HubConnection;

  apiUrl = Settings.ApiUrl;

  state = new Subject<any>();
    
  stateAsObservable(): Observable<any> {
    return this.state.asObservable();
  }

  currentConnectionData: Connection = new Connection();

  constructor(
    public toasterService: ToasterService,
    public router: Router
    ) { }

    startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/hub`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => { return localStorage.getItem('token')}
      })
      .build();

      this.hubConnection
      .start()
      .then(() => {
          this.state.next({type: HubResources.HubConnectionStartedState});
      })
      .catch(err => {
        this.toasterService.error(HubResources.ConnectionError)        
        console.log('Error while starting connection: ' + err)
    });
  }
}
