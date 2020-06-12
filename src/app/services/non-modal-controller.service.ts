import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
}) // TODO relocate
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

  create(options: {
    component: any /*ComponentRef*/;
    inputs?: { [key: string]: any }; // todo use interface for options
  }) {
    this.activeComponentRef = this.appendComponentToBody(
      options.component,
      options.inputs
    );
  }

  dismiss() {
    this.removeComponentFromBody(this.activeComponentRef);
    this.activeComponentRef = null;
  }

  private appendComponentToBody(
    component: any,
    inputs?: { [key: string]: any }
  ) {
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
