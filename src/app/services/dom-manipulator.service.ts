import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';
import { NonModalOptions } from '../models/non-modal-options';

@Injectable({
  providedIn: 'root',
})
export class DomManipulator {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  appendComponentToElement(options: NonModalOptions, elementId: string) {
    const { component, inputs } = { ...options };

    const componentRef = this.createComponentReference(component);
    if (inputs) {
      Object.assign(componentRef.instance, inputs);
    }

    this.appRef.attachView(componentRef.hostView);
    this.appendComponent(componentRef, elementId);

    return componentRef;
  }

  private createComponentReference(component: any) {
    return this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
  }

  private appendComponent(
    componentRef: ComponentRef<unknown>,
    elementId: string
  ) {
    const componentElement = this.getDomElementFromComponent(componentRef);
    const targetElement = this.getTargetElement(elementId);
    targetElement.appendChild(componentElement);
  }

  private getDomElementFromComponent(componentRef: ComponentRef<unknown>) {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  private getTargetElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Ensure your layout contains an <${elementId}> element`);
    }

    return element;
  }

  removeComponent(componentRef: ComponentRef<unknown>) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
