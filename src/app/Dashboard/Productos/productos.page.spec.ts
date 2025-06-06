import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosComponent } from './productos.page';

describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
