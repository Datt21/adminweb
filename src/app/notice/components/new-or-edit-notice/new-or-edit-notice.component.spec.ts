import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrEditNoticeComponent } from './new-or-edit-notice.component';

describe('NewOrEditNoticeComponent', () => {
  let component: NewOrEditNoticeComponent;
  let fixture: ComponentFixture<NewOrEditNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrEditNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrEditNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
