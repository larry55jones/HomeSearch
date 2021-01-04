import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulComponent } from './stateful/stateful.component';
import { NbCheckboxModule, NbFormFieldModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';

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
    NbSelectModule,
    NbInputModule,
    NbFormFieldModule
  ]
})
export class SharedModule { }
