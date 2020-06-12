import {
  Injectable,
  ApplicationRef,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DomManipulator {
  constructor(private appRef: ApplicationRef) {}

  appendComponentToElement(
    componentRef: ComponentRef<unknown>,
    elementId: string
  ) {
    this.appRef.attachView(componentRef.hostView);
    this.appendComponent(componentRef, elementId);
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
