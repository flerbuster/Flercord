import { Component, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { StandardMessageComponent } from '../standard-message/standard-message.component';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { Message, Recipient } from '../DiscordApi/Interface';
import { MessageButtonComponent } from '../message-button/message-button.component';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';

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

  changed = false

  ngOnInit() {
    DiscordGateway.getInstance().onEvent("MESSAGE_CREATE", (message: Message) => {
      if (message.channel_id == this.channel_id) {
        this.messages.push(message)

        setTimeout(() => {
          if ((this.messagesDiv.nativeElement.scrollTop - this.messagesDiv.nativeElement.scrollHeight) < 75) this.scrollToBottom()
        }, 200)
      }
    })
  }

  async ngOnChanges() {
    this.changed = true

    setTimeout(() => this.changed = false, 150)
    if (this.channel_id) {
      this.messages = await DiscordAPI.getMessages(this.channel_id)
    }

    setTimeout(() => {
      this.scrollToBottom()
    }, 200)

    setInterval(() => {
      if (this.isAtTop() && !this.fetching && this.messages.length > 0 && this.channel_id && !this.changed) {
        this.fetching = true
        let current = [...this.messages]
        let last = current[0].id;
        let cmax = this.messagesDiv.nativeElement.scrollHeight
        DiscordAPI.getMessagesBefore(last, this.channel_id)
        .then((newMessages) => {
          this.messages = [...current, ...newMessages].sort((a, b) => parseInt(a.id) - parseInt(b.id));
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
        //this.messages.push(message)
        setTimeout(() => {
          this.scrollToBottom()
        }, 200)
      })
    } 
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
  

  onType = (event: Event) => {
    if (this.getRandomInt(10) == 0 && this.channel_id) {
      DiscordAPI.type(this.channel_id)
    }
  }

  deleteMessage = (message: Message) => {
    
    DiscordAPI.deleteMessage(this.channel_id, message.id).then((data) => {
      this.messages = this.messages.filter((msg) => msg.id != message.id)
    })
  }
}
