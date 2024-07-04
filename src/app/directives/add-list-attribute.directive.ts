import { AfterViewInit, Directive, Renderer2 } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';

@Directive({
  selector: '[appAddListAttribute]',
  standalone: true,
})
export class AddListAttributeDirective implements AfterViewInit {
  constructor(private el: IonInput, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.getInputElement(this.el);
  }

  getInputElement(elRef: IonInput) {
    elRef.getInputElement().then((input: HTMLInputElement) => {
      this.renderer.setAttribute(input, 'list', 'idOfdataList');
    });
  }
}
