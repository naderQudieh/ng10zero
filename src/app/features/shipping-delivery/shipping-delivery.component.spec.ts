import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDeliveryComponent } from './shipping-delivery.component';

describe('ShippingDeliveryComponent', () => {
  let component: ShippingDeliveryComponent;
  let fixture: ComponentFixture<ShippingDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
