import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShopIndexComponent} from './index.component';

describe('StoreIndexComponent', () => {
  let component: ShopIndexComponent;
  let fixture: ComponentFixture<ShopIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShopIndexComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
