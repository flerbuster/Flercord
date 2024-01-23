import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildChannelSelectorComponent } from './guild-channel-selector.component';

describe('GuildChannelSelectorComponent', () => {
  let component: GuildChannelSelectorComponent;
  let fixture: ComponentFixture<GuildChannelSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildChannelSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildChannelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
