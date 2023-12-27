import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { StandardMessageComponent } from '../standard-message/standard-message.component';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { Message, Recipient } from '../DiscordApi/Interface';

@Component({
  selector: 'channel-view',
  standalone: true,
  imports: [
    StandardMessageComponent
  ],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent {
  constructor(private chRef: ChangeDetectorRef) { }

  @Input() channel_id: string | undefined = ""
  @Input() recipients: Recipient[] = []

  messages: Message[] = []



  async ngOnChanges() {
    if (this.channel_id) {
      console.log("getting messages")
      this.messages = await DiscordAPI.getMessages(this.channel_id)
      console.log("got messages: ", this.messages)
    }
  }

  getAvatar(recipient: Recipient) {
    return DiscordAPI.userAvatar(recipient)
  }
}
