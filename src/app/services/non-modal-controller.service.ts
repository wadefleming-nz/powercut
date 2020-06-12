import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NonModalOptions } from '../models/non-modal-options';

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

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  create(options: NonModalOptions) {
    this.activeComponentRef = this.appendComponentToBody(options);
  }

  dismiss() {
    this.removeComponentFromBody(this.activeComponentRef);
    this.activeComponentRef = null;
  }

  private appendComponentToBody(options: NonModalOptions) {
    const { component, inputs } = { ...options };
    // Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    if (inputs) {
      Object.assign(componentRef.instance, inputs);
    }

    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // Get dialog element
    const dialogElement = document.getElementById('non-modal-dialog-container');
    if (!dialogElement) {
      throw new Error(
        'Ensure your layout contains an <app-non-modal-dialog> element'
      );
    }

    // Append DOM element to the body
    dialogElement.appendChild(domElem);

    return componentRef;
  }

  private removeComponentFromBody(componentRef: ComponentRef<unknown>) {
    // remove it from the component tree and from the DOM
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
