import { Component } from '@angular/core';
import { SignalRService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public signalRService: SignalRService,) {}

  ngOnInit() {  
    this.signalRService.startConnection();
  }

  ngOnDestroy() {
    this.signalRService.hubConnection.off("askServerResponse");
  }
}
