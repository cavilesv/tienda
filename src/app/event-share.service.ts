import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventShareService {
  private focusSubject = new Subject<void>();
  private blurSubject = new Subject<void>();

  focus$ = this.focusSubject.asObservable();
  blur$ = this.blurSubject.asObservable();

  emitirFocus() {
    this.focusSubject.next();
  }

  emitirBlur() {
    this.blurSubject.next();
  }
}