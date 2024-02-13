import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { CommonModule } from '@angular/common';
import DiscordAPI from '../DiscordApi/DiscordApi';
import FlercordLocalStorage from '../LocalStorage/FlercordLocalStorage';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ErrorDialogComponent, CommonModule, LoadingSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  error: string = null
  loading: boolean = false

  constructor(private router: Router) { }

  onSubmit(form: NgForm) {
    const email = form.form.value.email
    const password = form.form.value.password

    this.loading = true

    DiscordAPI.login(email, password).then((response) => {
      this.loading = false
      if (response && response.token) {
        FlercordLocalStorage.token = response.token
  
        this.router.navigate(["/"])
      }
    })
  }
}
