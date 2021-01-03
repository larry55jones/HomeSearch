import { Component } from '@angular/core';

@Component({
  template: '',
})
export class StatefulComponent {
  public state: string = '';

  public isState(s: string): boolean {
    return this.state === s;
  }

  public setState(s: string): void {
    this.state = s;
  }
}
