import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlercordComponent } from './flercord.component';

describe('FlercordComponent', () => {
  let component: FlercordComponent;
  let fixture: ComponentFixture<FlercordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlercordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlercordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
