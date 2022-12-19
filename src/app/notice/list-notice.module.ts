import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ImageCropperModule } from "ngx-image-cropper";
import { SharedModule } from "../shared/shared.module";
import { ListNoticeComponent } from "./components/list-notice/list-notice.component";
import { ListNoticeRoutingModule } from "./list-notice-routing.module";
import { NoticeSearchComponent } from "./components/list-notice/notice-search/notice-search.component";
import { NoticeListService } from "./services/notice-list.service";
import { NewOrEditNoticeComponent } from './components/new-or-edit-notice/new-or-edit-notice.component';

@NgModule({
  declarations: [ListNoticeComponent, NoticeSearchComponent, NewOrEditNoticeComponent],
  imports: [
    CommonModule,
    SharedModule,
    ListNoticeRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    DragDropModule,
    ImageCropperModule,
  ],
  providers: [NoticeListService],
})
export class ListNoticeModule {}
