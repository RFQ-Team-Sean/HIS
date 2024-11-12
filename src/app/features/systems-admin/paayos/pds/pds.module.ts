import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PDSComponent } from './pds.component';

@NgModule({
  declarations: [PDSComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [PDSComponent]
  // other configurations
})
export class PDSModule { }
