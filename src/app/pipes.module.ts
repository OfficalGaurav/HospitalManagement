import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';  // Correct path

@NgModule({
  declarations: [SafePipe],
  imports: [CommonModule],
  exports: [SafePipe] 
})
export class PipesModule { } 