import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeSearchComponent } from './notice-search.component';

describe('NoticeSearchComponent', () => {
  let component: NoticeSearchComponent;
  let fixture: ComponentFixture<NoticeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
