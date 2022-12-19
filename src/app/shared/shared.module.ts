import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SanitizePipe } from "./pipes/sanitize.pipe";
import { KoshikiImagePipe } from "./pipes/koshiki-image.pipe";
import { PagerModule } from "./pagers/pager.module";
import { Utilities } from "./services/utilities.service";
import { calculateItemNoPipe } from "./pipes/calculate-item-no";

@NgModule({
  declarations: [SanitizePipe, KoshikiImagePipe, calculateItemNoPipe],
  imports: [CommonModule, PagerModule],
  providers: [SanitizePipe, Utilities],
  exports: [
    ReactiveFormsModule,
    KoshikiImagePipe,
    PagerModule,
    calculateItemNoPipe,
  ],
})
export class SharedModule {}
