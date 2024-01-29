import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-option-pill',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './option-pill.component.html',
  styleUrl: './option-pill.component.scss'
})
export class OptionPillComponent {
  @Input() name: string
  @Input() required: boolean
  @Output() changeText = new EventEmitter<string>()
  @Output() onFocus = new EventEmitter()
  
  value: string = ""

  changeValue = (text: string) => {
    this.changeText.emit(text)
  }
}
