import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulComponent } from './stateful/stateful.component';
import { NbCheckboxModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';

@NgModule({
  declarations: [StatefulComponent],
  imports: [
    CommonModule,
    NbSpinnerModule
  ],
  exports: [
    StatefulComponent,
    NbSpinnerModule,
    NbTooltipModule,
    NbCheckboxModule,
    NbSelectModule
  ]
})
export class SharedModule { }
