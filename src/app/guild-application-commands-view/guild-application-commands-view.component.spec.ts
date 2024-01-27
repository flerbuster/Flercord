import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildApplicationCommandsViewComponent } from './guild-application-commands-view.component';

describe('GuildApplicationCommandsViewComponent', () => {
  let component: GuildApplicationCommandsViewComponent;
  let fixture: ComponentFixture<GuildApplicationCommandsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildApplicationCommandsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildApplicationCommandsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
