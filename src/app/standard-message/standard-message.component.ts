import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attachment, Embed, Message } from '../DiscordApi/Interface';
import { DeletableDirective } from '../deletable/Deletable.directive';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';

@Component({
  selector: 'standard-message',
  standalone: true,
  imports: [DeletableDirective],
  templateUrl: './standard-message.component.html',
  styleUrl: './standard-message.component.scss'
})
export class StandardMessageComponent {
  @Input() message: Message;
  @Input() messages: Message[] = [];
  @Output() onDelete = new EventEmitter()

  isReply: boolean = false;

  deletable: boolean = false

  ngOnInit(): void {
    this.isReply = this.message.referenced_message != undefined
  }

  ngOnChanges() {
    this.deletable = this.message.author.id == DiscordGateway.getInstance().data.user.id
  }

  deleteSelf = () => {
    this.onDelete.emit()
  }

  getMinutesDifference(date1: Date, date2: Date): number {
    const timeDifference = date2.getTime() - date1.getTime();
    const minutesDifference = timeDifference / (1000 * 60); // 1000 milliseconds in a second, 60 seconds in a minute
    return minutesDifference;
  }

  isOnSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  shouldDrawSurroundings() {
    let index = this.messages.indexOf(this.message)
    if (index === 0) return true;
    let current = this.message as Message;
    let last = this.messages[index-1]
    
    if (current.author.id !== last.author.id) return true
    
    let last_timestamp = new Date(last.timestamp);
    let current_timestamp = new Date(current.timestamp)

    return this.getMinutesDifference(last_timestamp, current_timestamp) > 7
  }

  drawDayDiveder(): boolean {
    let index = this.messages.indexOf(this.message)
    if (index === 0) return true;
    let current = this.message as Message;
    let last = this.messages[index-1]
    
    let last_timestamp = new Date(last.timestamp);
    let current_timestamp = new Date(current.timestamp)

    return !this.isOnSameDay(current_timestamp, last_timestamp)
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  }

  getDeviderText() {
    return this.formatDate(new Date((this.message as Message).timestamp))
  }


  getMessageAuthorAvatarUrl(message: Message): string {
    const base = "https://cdn.discordapp.com/"
    if (!message.author) return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHN8VZBh3H-DJG7Cp3kfbRDnd7UF932qrhJMVqjA7uJw&sf"
    if (message.author.avatar) return base + "avatars/" + message.author.id + "/" + message.author.avatar;
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHN8VZBh3H-DJG7Cp3kfbRDnd7UF932qrhJMVqjA7uJw&sf"
  }

  getFormattedTimestamp(time: string): string {
    let timestamp = new Date(time)
    const zonedTimestamp = new Date(timestamp);
    const now = new Date();
    zonedTimestamp.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
  
    const formatter = new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    if (zonedTimestamp.getTime() === now.getTime()) {
      const formattedTime = new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(timestamp);
      return `Heute um ${formattedTime} Uhr`;
    } else if (zonedTimestamp.getTime() === now.getTime() - 86400000) {
      const formattedTime = new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(timestamp);
      return `Gestern um ${formattedTime} Uhr`;
    } else {
      return formatter.format(timestamp);
    }
  }

  isDisplayable(attachment: Attachment): boolean {
    // List of displayable image formats
    const displayableFormats = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".tif", ".webp", ".svg", ".ico"];
  
    // Get the file extension by splitting the filename at the last dot
    const fileExtension = attachment.filename.split('.').pop();
  
    // Check if the file extension is in the list of displayable formats
    return displayableFormats.includes(`.${fileExtension}`);
  }

  isVideo(attachment: Attachment): boolean {
    return attachment.filename.endsWith('.mp4')
  }

  getFileSize(attachment: Attachment): string {
    let size = attachment.size;

    if (size < 1000) {
      return `${size} bytes`
    } else if (size < 1000000) {
      return `${(size * 0.00095367431640625).toFixed(2)}kB`
    } else  {
      return `${(size * 0.00000095367431640625).toFixed(2)}mB`
    }
  }

  replyMessage(): Message {
    return this.message.referenced_message!
  }

  min(a: number, b: number): number {
    if (a > b) return b;
    return a;
  }

  hasUrl(embed: Embed) {
    return embed.url !== undefined
  }
  
  resizeProportional(width: number, height: number, maxWidth: number, maxHeight: number): { width: number, height: number } {
    const aspectRatio = width / height;

    if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
    }

    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }

    return { width, height };
}
}
