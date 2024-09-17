import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KebabMenuComponent } from './kebab-menu.component';

describe('KebabMenuComponent', () => {
  let component: KebabMenuComponent;
  let fixture: ComponentFixture<KebabMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [KebabMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KebabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
