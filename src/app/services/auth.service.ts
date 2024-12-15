import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
              private messageService: MessageService
  ) { }

  logout() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logout successful!' });
  }
}
