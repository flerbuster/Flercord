import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardMessageComponent } from './standard-message.component';

describe('StandardMessageComponent', () => {
  let component: StandardMessageComponent;
  let fixture: ComponentFixture<StandardMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
