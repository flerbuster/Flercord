import { Component, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { StandardMessageComponent } from '../standard-message/standard-message.component';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { Message, Recipient } from '../DiscordApi/Interface';
import { CommandSelect, FilledOptions, MessageButtonComponent } from '../message-button/message-button.component';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';
import { ToastState } from '../toast-alert/ToastState';
import { Component as Cmp } from '../DiscordApi/Interface';

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
  @Input() guild_id: string | undefined = ""
  @Input() recipients: Recipient[] = []

  replyTo: Message | undefined = undefined

  @ViewChild('messagesDiv')
  messagesDiv!: ElementRef;

  messages: Message[] = []

  fetching = false

  changed = false

  atTop = false

  ngOnInit() {

  }

  async ngOnChanges() {
    this.replyTo = undefined
    this.changed = true
    this.atTop = false

    setTimeout(() => this.changed = false, 300)
    if (this.channel_id) {
      this.messages = await DiscordAPI.getMessages(this.channel_id)
    }

    setTimeout(() => {
      this.scrollToBottom()
    }, 100)

    DiscordGateway.getInstance().onEvent("MESSAGE_CREATE", (message: Message) => {
      if (message.channel_id == this.channel_id) {
        if (!this.messages.find((msg) => msg.id == message.id)) {
          this.messages.push(message)

          setTimeout(() => {
            if ((this.messagesDiv.nativeElement.scrollTop - this.messagesDiv.nativeElement.scrollHeight) < 75) this.scrollToBottom()
          }, 200)
        }
      }
    })

    DiscordGateway.getInstance().onEvent("MESSAGE_UPDATE", (message: Message) => {
      let index = this.messages.findIndex((msg) => msg.id == message.id)
      if (index >= 0) {
        if (message.embeds) this.messages[index].embeds = message.embeds
        if (message.components) this.messages[index].components = message.components
        this.messages[index].content = message.content
        this.messages[index].edited_timestamp = new Date().toString()
      }
    })

    setInterval(() => {
      if (this.isAtTop() && !this.fetching && this.messages.length > 0 && this.channel_id && !this.changed && !this.atTop) {
        this.fetching = true
        let current = [...this.messages]
        let last = current[0].id;
        let cmax = this.messagesDiv.nativeElement.scrollHeight
        DiscordAPI.getMessagesBefore(last, this.channel_id)
        .then((newMessages) => {
          if (!this.changed && !this.atTop) {
          this.messages = [...current, ...newMessages].sort((a, b) => parseInt(a.id) - parseInt(b.id));
          setTimeout(() => {
            let nmax = this.messagesDiv.nativeElement.scrollHeight
            if (nmax == cmax) {
              this.atTop = true
            }
          
            if ((this.messagesDiv.nativeElement.scrollTop - cmax) > 100 )this.scrollToBottom()
            else this.scrollTo(nmax - cmax)
            this.fetching = false
          }, 30)
        } else {
          this.fetching = false
        }
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
    let reply = this.replyTo
    this.replyTo = undefined
    if (message && this.channel_id) {
      if (reply) {
        DiscordAPI.respondToMessage(this.channel_id, reply.id, message).then((message: Message) => {
          if (message.id) setTimeout(() => {
            if (!this.messages.find((msg) => msg.id == message.id)) this.messages.push(message)

            this.scrollToBottom()
          }, 200)
        })
      } else { 
        DiscordAPI.sendMessage(this.channel_id, message).then((message: Message) => {
          if (message.id) setTimeout(() => {
            if (!this.messages.find((msg) => msg.id == message.id)) this.messages.push(message)
            this.scrollToBottom()
          }, 200)
        })
      }
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
    console.log("delete: ", message)
    DiscordAPI.deleteMessage(this.channel_id, message.id).then((data) => {
      this.messages = this.messages.filter((msg) => msg.id != message.id)
    }).then(() => {
      ToastState.addToast({
        title: "deleted message",
        text: message.content,
        type: "success"
      })
    })
  }

  startReply(message: Message) {
    this.replyTo = message
  }

  endReply() {
    this.replyTo = undefined
  }

  useCommand(event: { command: CommandSelect, filledOptions: FilledOptions }) {
    let builtIn = DiscordAPI.findBuiltinCommand(event.command.command.id)
    if (builtIn == undefined) {
      console.log("using command: ", event.command)
      DiscordAPI.useCommand(this.guild_id, this.channel_id, event.command.command, event.command.application, event.filledOptions).then(() => {
        console.log("command: ", event.command, " !")
      })
    } else {
      builtIn.handleCall(this.channel_id, this.guild_id, event.filledOptions)
    }
  }

  clickComponent(component: Cmp, message: Message) {
    DiscordAPI.clickButton(message.application_id ?? "", message.channel_id, this.guild_id, message.id, component,
      message.flags)
  }
}
