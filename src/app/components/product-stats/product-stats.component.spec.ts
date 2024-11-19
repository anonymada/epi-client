import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductStatsComponent } from './product-stats.component';

describe('ProductStatsComponent', () => {
  let component: ProductStatsComponent;
  let fixture: ComponentFixture<ProductStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
