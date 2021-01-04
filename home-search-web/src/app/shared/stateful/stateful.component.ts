import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class StatefulComponent implements OnDestroy {
  public destroy$ = new Subject<void>();
  public state: string = '';
  onDestroyAction = () => 0;

  public isState(s: string): boolean {
    return this.state === s;
  }

  public setState(s: string): void {
    this.state = s;
  }

  public doThisOnDestroy(act: any) {
    this.onDestroyAction = act;
  }

  ngOnDestroy() {
    if (this.onDestroyAction) {
      this.onDestroyAction();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
