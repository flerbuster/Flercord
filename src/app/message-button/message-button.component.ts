import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
}
