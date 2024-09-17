import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { I18NComponent } from './i18-n.component';

describe('I18NComponent', () => {
  let component: I18NComponent;
  let fixture: ComponentFixture<I18NComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18NComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(I18NComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
