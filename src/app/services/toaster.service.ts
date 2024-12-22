import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private messageService: MessageService) { }

  success(detail: string, summary?: string) {
    this.messageService.add({ severity: 'success', summary: summary ?? 'Success', detail: detail });
  }

  info(detail: string, summary?: string) {
      this.messageService.add({ severity: 'info', summary: summary ?? 'Info', detail: detail });
  }

  warn(detail: string, summary?: string) {
      this.messageService.add({ severity: 'warn', summary: summary ?? 'Warn', detail: detail });
  }

  error(detail: string, summary?: string) {
      this.messageService.add({ severity: 'error', summary: summary ?? 'Error', detail: detail });
  }
}
