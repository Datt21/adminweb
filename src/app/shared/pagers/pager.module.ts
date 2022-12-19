import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagerComponent } from "./pager/pager.component";
import { PagerService } from "./services/index";
@NgModule({
  imports: [CommonModule],
  declarations: [PagerComponent],
  providers: [PagerService],
  exports: [PagerComponent],
})
export class PagerModule {}
