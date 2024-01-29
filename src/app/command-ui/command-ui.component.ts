import { Component } from '@angular/core';
import { Command } from '../command/Command';
import FlercordLocalStorage from '../LocalStorage/FlercordLocalStorage';
import { Author } from '../DiscordApi/Interface';
import DiscordAPI from '../DiscordApi/DiscordApi';

@Component({
  selector: 'app-command-ui',
  standalone: true,
  imports: [],
  templateUrl: './command-ui.component.html',
  styleUrl: './command-ui.component.scss'
})
export class CommandUiComponent {
  commands: Command[] = [];

  ngOnInit() {
    this.commands = [...FlercordLocalStorage.commands]
    window.addEventListener("storage", () => {
      this.commands = [...FlercordLocalStorage.commands]
    })
  }

  getAvatar(author: Author): string {
    return DiscordAPI.userAvatar(author)
  }

  getTimeSince(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    }
}
}
