import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SanitizePipe} from './pipes/sanitize.pipe';
import { KoshikiImagePipe } from './pipes/koshiki-image.pipe';

@NgModule({
  declarations: [SanitizePipe, KoshikiImagePipe],
  imports: [
    CommonModule
  ],
  providers: [SanitizePipe],
  exports: [ReactiveFormsModule, KoshikiImagePipe]
})
export class SharedModule {
}
