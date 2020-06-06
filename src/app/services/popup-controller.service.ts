import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
}) // TODO rename/relocate
export class PopupController {
  activeComponentRef: ComponentRef<unknown> = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  create(options: { component: any /*ComponentRef*/ }) {
    this.activeComponentRef = this.appendComponentToBody(options.component);
  }

  dismiss() {
    this.removeComponentFromBody(this.activeComponentRef);
    this.activeComponentRef = null;
  }

  private appendComponentToBody(component: any) {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);

    return componentRef;
  }

  private removeComponentFromBody(componentRef: ComponentRef<unknown>) {
    // remove it from the component tree and from the DOM
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
