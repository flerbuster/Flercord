import { Component, ChangeDetectorRef } from '@angular/core';
import { DiscordGateway } from './DiscordApi/DiscordGateway';
import { Guild, ReadyEvent } from './DiscordApi/Interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Flercord';
  constructor(private chRef: ChangeDetectorRef){}


  guilds: Guild[] = [];

  ngOnInit() {
    DiscordGateway.getInstance().onEvent("READY", (event => {
      this.guilds = (event as ReadyEvent).guilds || []

      this.chRef.detectChanges()
    }))
  }

}
