import { Component, Input } from '@angular/core';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { DmChannel, Recipient, SharedChannel, Status } from '../DiscordApi/Interface';

export interface DisplayableDmChannel {
  name: string,
  icon_url: string,
  description: string,
  id: string,
  recipients: Recipient[],
  status?: Status,

  channel: SharedChannel
}

@Component({
  selector: 'dm-channels',
  standalone: true,
  imports: [],
  templateUrl: './dm-channels.component.html',
  styleUrl: './dm-channels.component.scss'
})
export class DmChannelsComponent {
  @Input() onClickChannel: (channel: DisplayableDmChannel) => any = () => {};
  @Input() open_channel: SharedChannel | undefined = undefined

  dmChannels = DiscordAPI.sortDmChannels(DiscordGateway.getInstance().data?.private_channels || []).map((it) => this.displayableDmChannel(it))

  displayableDmChannel(dmChannel: DmChannel): DisplayableDmChannel {
    let name = ""
    let icon_url = ""
    let description = ""
    if (dmChannel.name) name = dmChannel.name
    else name = dmChannel.recipients.map((it) => it.global_name || it.username).join(", ")

    let maxsize = 25

    if (name.length > maxsize) name = name.substring(0, maxsize-3) + "..."

    if (dmChannel.icon) icon_url = `https://cdn.discordapp.com/channel-icons/${dmChannel.id}/${dmChannel.icon}`;
    else if (dmChannel.recipients.length) icon_url =  DiscordAPI.userAvatar(dmChannel.recipients[0])
    

    description = dmChannel.recipients.length + " recipient(s)"

    return {
      name: name,
      icon_url: icon_url,
      description: description,
      id: dmChannel.id,
      recipients: dmChannel.recipients,

      channel: dmChannel
    }
  }
}
