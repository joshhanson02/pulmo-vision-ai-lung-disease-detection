import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiBotBridgeService {
  private messageSource = new Subject<string>();
  message$ = this.messageSource.asObservable();

  sendInitialMessage(message: string) {
    this.messageSource.next(message);
  }
}
