import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicationCommandOptionChoice } from '../DiscordApi/Interface';

@Component({
  selector: 'app-option-pill',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './option-pill.component.html',
  styleUrl: './option-pill.component.scss',
})
export class OptionPillComponent {
  @Input() name: string;
  @Input() required: boolean;
  @Input() possibleValues: ApplicationCommandOptionChoice[] = [];
  @Output() changeText = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter();

  filteredValues: ApplicationCommandOptionChoice[] = this.possibleValues;

  filter: string = '';

  value: string = '';

  clickValue = (text: string) => {
    this.value = text;
    this.filter = '';
    this.changeText.emit(text)
  };

  changeValue = (text: string) => {
    this.changeText.emit(text);
    if (this.possibleValues.length == 0) {
    } else {
      this.filter = text;
      this.filteredValues = this.possibleValues.filter((it) =>
        it.name.includes(text)
      );
    }
  };
}
