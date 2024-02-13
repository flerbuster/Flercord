import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  @Input() error: string
  @Output() dismiss = new EventEmitter()
}
