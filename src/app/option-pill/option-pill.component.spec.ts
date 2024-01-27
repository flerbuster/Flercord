import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionPillComponent } from './option-pill.component';

describe('OptionPillComponent', () => {
  let component: OptionPillComponent;
  let fixture: ComponentFixture<OptionPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionPillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
