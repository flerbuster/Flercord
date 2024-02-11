import { Component, ChangeDetectorRef } from '@angular/core';
import {
  DmChannel,
  Guild,
  GuildFolder,
  ReadyEvent,
  Recipient,
  SharedChannel,
} from '../DiscordApi/Interface';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';
import FlercordLocalStorage from '../LocalStorage/FlercordLocalStorage';
import { FormsModule } from '@angular/forms';
import {
  DisplayableDmChannel,
  DmChannelsComponent,
} from '../dm-channels/dm-channels.component';
import { ChannelViewComponent } from '../channel-view/channel-view.component';
import { GuildChannelSelectorComponent } from '../guild-channel-selector/guild-channel-selector.component';
import { ToastAlertComponent } from '../toast-alert/toast-alert.component';
import { ToastState } from '../toast-alert/ToastState';
import { GuildFolderComponent } from '../guild-folder/guild-folder.component';
import { GuildIconComponent } from '../guild-icon/guild-icon.component';
import { flatten } from '../DiscordApi/FlercordBuiltinCommands';

export interface Folder {
  guilds: Guild[];
  color: number;
  id: number;
}

@Component({
  selector: 'app-flercord',
  standalone: true,
  imports: [
    FormsModule,
    DmChannelsComponent,
    ChannelViewComponent,
    GuildChannelSelectorComponent,
    ToastAlertComponent,
    GuildFolderComponent,
    GuildIconComponent,
  ],
  templateUrl: './flercord.component.html',
  styleUrl: './flercord.component.scss',
})
export class FlercordComponent {
  constructor(private chRef: ChangeDetectorRef) {}

  toasts = [];

  initialized = false;

  token = FlercordLocalStorage.token;

  tokeninput = '';

  guilds: Guild[] = [];
  guild_folders: Folder[] = [];
  recipients: Recipient[] = [];

  open_channel: SharedChannel | undefined = undefined;
  open_guild: Guild | undefined = undefined;

  mapGuilds(guilds: Guild[], folders: GuildFolder[]) {
    const guildFolders: Folder[] = [];

    folders.forEach((folder) => {
      console.log('folder: ', folder);
      if (!folder.id) return;
      folder.guild_ids.forEach((guild_id) => {
        const guild = guilds.find((guild) => guild.id == guild_id);
        if (guild) {
          const guildFolder: Folder | undefined = guildFolders.find(
            (guildFolder) => folder.id == guildFolder.id
          );
          if (guildFolder) guildFolder.guilds.push(guild);
          else
            guildFolders.push({
              id: folder.id,
              color: folder.color,
              guilds: [],
            });
        }
      });
    });

    return guildFolders;
  }

  filterNotInFoldersGuilds(guilds: Guild[], folders: GuildFolder[]) {
    const result: Guild[] = guilds;

    let i = 0;
    const allGuildIds = flatten(folders.map((folder) => folder.id ? folder.guild_ids : []))
    allGuildIds.forEach((id) => {
      const index = result.findIndex(guild => guild.id == id)
      if (index >= 0) {
        console.log("found ", id)
        result.splice(index, 1)
      }
    })

    return result;
  }

  on_click_channel = (channel: DisplayableDmChannel) => {
    this.open_channel = channel.channel;
    this.recipients = channel.recipients;
  };

  onOpenChannel(channel: SharedChannel) {
    this.open_channel = channel;
  }

  initialize() {
    const discordGateway = DiscordGateway.getInstance();
    discordGateway.connectToWebSocket();

    DiscordGateway.getInstance().onEvent('READY', (event) => {
      //this.guilds = (event as ReadyEvent).guilds || []
      const folders = (event as ReadyEvent).user_settings?.guild_folders;
      const guilds = (event as ReadyEvent).guilds;
      this.guild_folders = this.mapGuilds(guilds, folders);
      this.guilds = this.filterNotInFoldersGuilds(guilds, folders);
      this.initialized = true;
      //this.chRef.detectChanges()
    });
  }

  ngOnInit() {
    ToastState.toastAdd.subscribe((toast) => this.toasts.push(toast));
    ToastState.toastDelete.subscribe((index) => this.toasts.splice(index, 1));

    if (this.token) {
      this.initialize();
    }
  }

  deleteToast(index: number) {
    ToastState.deleteToast(index);
  }

  settoken() {
    this.token = this.tokeninput;
    FlercordLocalStorage.token = this.tokeninput;

    this.initialize();
  }

  clearToken() {
    this.token = '';
    FlercordLocalStorage.deleteToken();
  }

  getGuildIconUrl(guild: Guild) {
    const base = 'https://cdn.discordapp.com/icons/';
    if (guild?.icon) {
      return base + guild.id + '/' + guild.icon;
    }
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHN8VZBh3H-DJG7Cp3kfbRDnd7UF932qrhJMVqjA7uJw&sf';
  }

  selectGuild(guild: Guild) {
    this.open_guild = guild;
    this.open_channel = undefined;
  }
}
