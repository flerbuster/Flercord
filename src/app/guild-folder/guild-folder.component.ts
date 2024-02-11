import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Folder } from '../flercord/flercord.component';
import { Guild } from '../DiscordApi/Interface';
import { GuildIconComponent } from '../guild-icon/guild-icon.component';

@Component({
  selector: 'app-guild-folder',
  standalone: true,
  imports: [GuildIconComponent],
  templateUrl: './guild-folder.component.html',
  styleUrl: './guild-folder.component.scss',
})
export class GuildFolderComponent {
  @Input() folder: Folder;
  @Output() selectGuild = new EventEmitter<Guild>();

  get color() {
    if (!this.folder.color) return '#e3f1b3';
    return '#' + this.folder.color.toString(16).padStart(6, '0');
  }

  getGuildIconUrl(guild: Guild) {
    const base = 'https://cdn.discordapp.com/icons/';
    if (guild?.icon) {
      return base + guild.id + '/' + guild.icon;
    }
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHN8VZBh3H-DJG7Cp3kfbRDnd7UF932qrhJMVqjA7uJw&sf';
  }

  expanded = false;
}
