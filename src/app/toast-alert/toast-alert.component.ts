import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeletableDirective } from '../deletable/Deletable.directive';
import { Toast } from './ToastState';

@Component({
  selector: 'app-toast-alert',
  standalone: true,
  imports: [
    DeletableDirective],
  templateUrl: './toast-alert.component.html',
  styleUrl: './toast-alert.component.scss'
})
export class ToastAlertComponent {
  @Input() toast: Toast
  @Output() onDelete = new EventEmitter()

  ngOnInit() {
    setTimeout(() => this.deleteSelf(), 3000)
  }

  deleteSelf = () => {
    console.log(this.onDelete)
    this.onDelete.emit()
  }
}
