import { Injectable, ComponentRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NonModalOptions } from '../models/non-modal-options';
import { DomManipulator } from './dom-manipulator.service';

@Injectable({
  providedIn: 'root',
})
export class NonModalController {
  private _activeComponentRef = null;
  private get activeComponentRef() {
    return this._activeComponentRef;
  }
  private set activeComponentRef(value: ComponentRef<unknown>) {
    this._activeComponentRef = value;
    this.activeSubject.next(!!value);
  }

  private activeSubject = new BehaviorSubject<boolean>(false);
  active$ = this.activeSubject.asObservable();

  constructor(private domManipulator: DomManipulator) {}

  create(options: NonModalOptions) {
    this.activeComponentRef = this.domManipulator.appendComponentToElement(
      options,
      'non-modal-dialog-container'
    );
  }

  dismiss() {
    this.domManipulator.removeComponent(this.activeComponentRef);
    this.activeComponentRef = null;
  }
}
