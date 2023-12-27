import { Component, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { StandardMessageComponent } from '../standard-message/standard-message.component';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { Message, Recipient } from '../DiscordApi/Interface';
import { MessageButtonComponent } from '../message-button/message-button.component';

@Component({
  selector: 'channel-view',
  standalone: true,
  imports: [
    StandardMessageComponent,
    MessageButtonComponent
  ],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent {
  constructor(private chRef: ChangeDetectorRef) { }

  @Input() channel_id: string | undefined = ""
  @Input() recipients: Recipient[] = []

  @ViewChild('messagesDiv')
  messagesDiv!: ElementRef;

  messages: Message[] = []

  fetching = false



  async ngOnChanges() {
    if (this.channel_id) {
      this.messages = await DiscordAPI.getMessages(this.channel_id)
    }

    setTimeout(() => {
      this.scrollToBottom()
    }, 200)

    setInterval(() => {
      if (this.isAtTop() && !this.fetching && this.messages.length > 0 && this.channel_id) {
        this.fetching = true
        let current = [...this.messages].reverse()
        let last = current[0].id;
        let cmax = this.messagesDiv.nativeElement.scrollHeight
        DiscordAPI.getMessagesBefore(last, this.channel_id)
        .then((newMessages) => {
          this.messages = [...newMessages, ...current];
          setTimeout(() => {
            let nmax = this.messagesDiv.nativeElement.scrollHeight
          
            this.scrollTo(nmax - cmax)
            this.fetching = false
          }, 200)
        })
        .catch((error) => {
          console.log('Error fetching messages:', error);
          this.fetching = false
        });
      
      }
    }, 250)
  }

  
  scrollTo(px: number) {
    this.messagesDiv.nativeElement.scrollTop =px
  }

  scrollToBottom() {
    this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight
  }

  isAtTop(margin: number = 55): boolean {
    return this.messagesDiv.nativeElement.scrollTop < margin
  }

  getAvatar(recipient: Recipient) {
    return DiscordAPI.userAvatar(recipient)
  }

  sendMessage = (message: string) => {
    if (message && this.channel_id) {
      DiscordAPI.sendMessage(this.channel_id, message).then((message: Message) => {
        this.messages.push(message)
        setTimeout(() => {
          this.scrollToBottom()
        }, 200)
      })
    } 
  }
}
