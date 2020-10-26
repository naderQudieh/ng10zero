import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdcartComponent } from './prodcart.component';

describe('ProdcartComponent', () => {
  let component: ProdcartComponent;
  let fixture: ComponentFixture<ProdcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
