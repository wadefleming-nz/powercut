import { Injectable, Injector, ComponentFactoryResolver } from '@angular/core';
import { NonModalOptions } from '../models/non-modal-options';

@Injectable({
  providedIn: 'root',
})
export class ComponentCreator {
  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  create(options: NonModalOptions) {
    const { component, inputs } = { ...options };

    const componentRef = this.createComponentReference(component);
    if (inputs) {
      Object.assign(componentRef.instance, inputs);
    }

    return componentRef;
  }

  private createComponentReference(component: any) {
    return this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
  }
}
