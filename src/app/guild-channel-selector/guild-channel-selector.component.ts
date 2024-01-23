import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChannelGroup, ChannelType, DetailedGuildInfo, Guild, GuildChannel, SharedChannel } from '../DiscordApi/Interface';
import { ChannelGroupViewComponent } from '../channel-group-view/channel-group-view.component';
import DiscordAPI from '../DiscordApi/DiscordApi';


@Component({
  selector: 'guild-channel-selector',
  standalone: true,
  imports: [ChannelGroupViewComponent],
  templateUrl: './guild-channel-selector.component.html',
  styleUrl: './guild-channel-selector.component.scss'
})
export class GuildChannelSelectorComponent {
  @Input() data: any;
  @Input() open_channel: SharedChannel | undefined = undefined;
  @Input() guild: Guild | undefined = undefined

  
  @Output() toggle_channel = new EventEmitter<SharedChannel>()


  guild_channels: GuildChannel[] = [];


  channel_groups: ChannelGroup[] = [];

  async ngOnChanges() {
    console.log("changed")
    this.fetchChannels()
  }

  async ngOnInit(): Promise<void> {
    console.log("changed!")
    this.fetchChannels()
  }

  async fetchChannels() {
    console.log(this.guild)
    if (this.guild) {
      this.guild_channels = await DiscordAPI.getChannels(this.guild.id)
      console.log(this.guild_channels)
      this.channel_groups = this.groupChannels()
    }
  }

  async onOpenChannel(channel: SharedChannel) {
    this.toggle_channel.emit(channel)
  }

  groupChannels(): ChannelGroup[] {
    const channelGroups: ChannelGroup[] = [];
    const channelMap = new Map<string, ChannelGroup>();
  
    for (const channel of this.guild_channels) {
      if (channel.type === ChannelType.Parent) {
        const channelGroup: ChannelGroup = {
          parent: channel,
          children: [],
        };
        channelGroups.push(channelGroup);
        channelMap.set(channel.id, channelGroup);
      } else {
        if (channel.parent_id === undefined) {
          channelGroups.push({
            parent: null,
            children: [channel],
          });
        } else {
          const parentGroup = channelMap.get(channel.parent_id);
          if (parentGroup) {
            parentGroup.children.push(channel);
          } else {
            const newParent = this.guild_channels.find(
              (c) => c.id === channel.parent_id
            );
            if (newParent) {
              const newParentGroup: ChannelGroup = {
                parent: newParent,
                children: [channel],
              };
              channelGroups.push(newParentGroup);
              channelMap.set(channel.parent_id, newParentGroup);
            } else {
            }
          }
        }
      }
    }
  
    return channelGroups.filter(group => group.children.length > 0);
  }
}
