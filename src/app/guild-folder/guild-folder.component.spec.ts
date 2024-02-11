import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildFolderComponent } from './guild-folder.component';

describe('GuildFolderComponent', () => {
  let component: GuildFolderComponent;
  let fixture: ComponentFixture<GuildFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildFolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
