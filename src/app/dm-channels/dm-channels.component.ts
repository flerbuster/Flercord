import { Component, Input } from '@angular/core';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { DmChannel, Status } from '../DiscordApi/Interface';

export interface DisplayableDmChannel {
  name: string,
  icon_url: string,
  description: string,
  id: string,
  status?: Status
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
  @Input() open_channel: string | undefined = ""

  dmChannels = DiscordAPI.sortDmChannels(DiscordGateway.getInstance().data?.private_channels || []).map((it) => this.displayableDmChannel(it))

  displayableDmChannel(dmChannel: DmChannel): DisplayableDmChannel {
    let name = ""
    let icon_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png"
    let description = ""
    if (dmChannel.name) name = dmChannel.name
    else name = dmChannel.recipients.map((it) => it.global_name || it.username).join(", ")

    let maxsize = 25

    if (name.length > maxsize) name = name.substring(0, maxsize-3) + "..."

    if (dmChannel.icon) icon_url = `https://cdn.discordapp.com/channel-icons/${dmChannel.id}/${dmChannel.icon}`;
    else if (dmChannel.recipients.length > 0 && dmChannel.recipients[0].avatar) icon_url =  `https://cdn.discordapp.com/avatars/${dmChannel.recipients[0].id}/${dmChannel.recipients[0].avatar}`
    

    description = dmChannel.recipients.length + " recipient(s)"

    return {
      name: name,
      icon_url: icon_url,
      description: description,
      id: dmChannel.id
    }
  }
}
