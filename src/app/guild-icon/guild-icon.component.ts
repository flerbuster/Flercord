import { Component, Input, Output } from '@angular/core';
import { Guild } from '../DiscordApi/Interface';
import { EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guild-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guild-icon.component.html',
  styleUrl: './guild-icon.component.scss'
})
export class GuildIconComponent {
  @Input() guild: Guild
  @Input() size: number = 1
  @Output() select = new EventEmitter<Guild>()

  get scale() {
    return `scale(${this.size})`
  }

  get calc() {
    return `calc(1rem - calc(1rem * ${(1-this.size)*3}))`
  }

  getGuildIconUrl(guild: Guild) {
    const base = 'https://cdn.discordapp.com/icons/';
    if (guild?.icon) {
      return base + guild.id + '/' + guild.icon;
    }
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHN8VZBh3H-DJG7Cp3kfbRDnd7UF932qrhJMVqjA7uJw&sf';
  }
}
