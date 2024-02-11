import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { DiscordGateway, EventCallback } from './DiscordApi/DiscordGateway';
import { Guild, ReadyEvent } from './DiscordApi/Interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Flercord';
  constructor(private chRef: ChangeDetectorRef){}


  guilds: Guild[] = [];

  eventListeners: EventCallback[] = []

  ngOnInit() {
    this.eventListeners.push(DiscordGateway.getInstance().onEvent("READY", (event => {
      this.guilds = (event as ReadyEvent).guilds || []

      this.chRef.detectChanges()
    })))
  }

  ngOnDestroy(): void {
      for (let listener of this.eventListeners) {
        DiscordGateway.getInstance().destroyListener(listener.id)
      }

      this.eventListeners = []
  }

}
