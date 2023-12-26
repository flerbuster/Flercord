import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelViewComponent } from './channel-view.component';

describe('ChannelViewComponent', () => {
  let component: ChannelViewComponent;
  let fixture: ComponentFixture<ChannelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
