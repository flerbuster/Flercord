import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupViewComponent } from './channel-group-view.component';

describe('ChannelGroupViewComponent', () => {
  let component: ChannelGroupViewComponent;
  let fixture: ComponentFixture<ChannelGroupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelGroupViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
