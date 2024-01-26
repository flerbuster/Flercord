import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Author, Message } from '../DiscordApi/Interface';
import DiscordAPI from '../DiscordApi/DiscordApi';

@Component({
  selector: 'message-button',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './message-button.component.html',
  styleUrl: './message-button.component.scss'
})
export class MessageButtonComponent {
  @Input() sendMessage: (message: string) => any = () => {};
  @Input() onType: (event: Event) => any = () => {}
  @Input() replyMessage: Message

  current_message: string = ""


  @ViewChild('messageDiv')
  messageDiv!: ElementRef;

  setValue(text: string) {
    const element = this.messageDiv.nativeElement
    this.current_message = text;
    element.innerText = text
  }

  onInput(event: Event) {
    const element = this.messageDiv.nativeElement;
    this.current_message = element.innerText;
    this.onType(event)
  }

  send() {
    this.sendMessage(this.current_message)
    this.setValue("")
  }

  getAvatar(author: Author) {
    return DiscordAPI.userAvatar(author)
  }
}
