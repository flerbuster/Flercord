import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmChannelsComponent } from './dm-channels.component';

describe('DmChannelsComponent', () => {
  let component: DmChannelsComponent;
  let fixture: ComponentFixture<DmChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmChannelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DmChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
