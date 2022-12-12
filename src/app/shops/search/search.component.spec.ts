import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSearchComponent } from './search.component';

describe('ShopSearchComponent', () => {
  let component: ShopSearchComponent;
  let fixture: ComponentFixture<ShopSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
