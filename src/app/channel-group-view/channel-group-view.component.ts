import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChannelGroup, ChannelType, GuildChannel, SharedChannel } from '../DiscordApi/Interface';

@Component({
  selector: 'app-channel-group-view',
  standalone: true,
  imports: [],
  templateUrl: './channel-group-view.component.html',
  styleUrl: './channel-group-view.component.scss'
})
export class ChannelGroupViewComponent {
  @Input() channel_group: any;
  @Input() open_channel: SharedChannel | undefined;

  @Output() toggle_channel = new EventEmitter<GuildChannel>();

  expanded: boolean = true;

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  changeChannel(ch: GuildChannel) {
    this.toggle_channel.emit(ch);
  }

  getSvgPath(channel: GuildChannel) {
    if (channel.type == ChannelType.News) return 'assets/newschannel.svg';
    else if (channel.type == ChannelType.Voice)
      return 'assets/voicechannel.svg';
    else if (channel.type == ChannelType.Parent) return '';
    return 'assets/normalchannel.svg';
  }

  getExpandedChildrenOfChannelGroup(
    channelGroup: ChannelGroup
  ): Array<GuildChannel> {
    if (this.expanded) return channelGroup.children;
    let children: Array<GuildChannel> = [];
    for (let child of channelGroup.children) {
      console.log('children: ', child, ', open: ', this.open_channel);
      if (child.id == this.open_channel?.id) children.push(child);
    }
    return children;
  }

  hasUnread(channel: GuildChannel) {
    return false
  }
}
