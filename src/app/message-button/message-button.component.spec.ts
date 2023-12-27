import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageButtonComponent } from './message-button.component';

describe('MessageButtonComponent', () => {
  let component: MessageButtonComponent;
  let fixture: ComponentFixture<MessageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
