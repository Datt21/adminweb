import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListNoticeComponent } from "./components/list-notice/list-notice.component";
import { NewOrEditNoticeComponent } from "./components/new-or-edit-notice/new-or-edit-notice.component";

const routes: Routes = [
  {
    path: "",
    component: ListNoticeComponent,
  },
  {
    path: "add",
    component: NewOrEditNoticeComponent,
  },
  {
    path: "edit/:id",
    component: NewOrEditNoticeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListNoticeRoutingModule {}
