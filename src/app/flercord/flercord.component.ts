import { Component, ChangeDetectorRef } from '@angular/core';
import { DmChannel, Guild, ReadyEvent, Recipient } from '../DiscordApi/Interface';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';
import FlercordLocalStorage from '../LocalStorage/FlercordLocalStorage';
import { FormsModule } from '@angular/forms';
import { DisplayableDmChannel, DmChannelsComponent } from '../dm-channels/dm-channels.component';
import { ChannelViewComponent } from '../channel-view/channel-view.component';

@Component({
  selector: 'app-flercord',
  standalone: true,
  imports: [
    FormsModule,
    DmChannelsComponent,
    ChannelViewComponent
  ],
  templateUrl: './flercord.component.html',
  styleUrl: './flercord.component.scss'
})
export class FlercordComponent {
  constructor(private chRef: ChangeDetectorRef) { }

  initialized = false

  token = FlercordLocalStorage.token

  tokeninput = ""

  guilds: Guild[] = [];
  recipients: Recipient[] = [];



  open_channel: string | undefined = undefined

  on_click_channel = (channel: DisplayableDmChannel) => {
    this.open_channel = channel.id
    this.recipients = channel.recipients
  }



  initialize() {
    const discordGateway = DiscordGateway.getInstance();
    discordGateway.connectToWebSocket()


    DiscordGateway.getInstance().onEvent("READY", (event => {
      this.guilds = (event as ReadyEvent).guilds || []
      this.initialized = true
      //this.chRef.detectChanges()

    }))
  }

  ngOnInit() {
    if (this.token) {
      this.initialize()
    }
  }

  settoken() {
    this.token = this.tokeninput
    FlercordLocalStorage.token = this.tokeninput

    this.initialize()
  }

  getGuildIconUrl(guild: Guild) {
    const base = "https://cdn.discordapp.com/icons/"
    if (guild?.icon) {
      return base + guild.id + "/" + guild.icon
    }
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHN8VZBh3H-DJG7Cp3kfbRDnd7UF932qrhJMVqjA7uJw&sf"
  }
}
