import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselInvoiceComponent } from './carousel-invoice.component';

describe('CarouselInvoiceComponent', () => {
  let component: CarouselInvoiceComponent;
  let fixture: ComponentFixture<CarouselInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
