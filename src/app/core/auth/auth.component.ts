import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { UserData } from '../interfaces/user-data.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  isLogin: boolean = true;
  constructor(private authService: AuthService){}
  UsernameError: string | undefined;
  EmailError: string | undefined;
  PasswordError: string | undefined;
  InvalidError: string | undefined;
  errorHandling(error: any) {
    if (error.status == 400) {
      console.log(error.title);
      if (error.errors["Username"]) {
        this.UsernameError = error.errors["Username"][0];
      }
      if (error.errors["Password"]) {
        this.PasswordError = error.errors["Password"][0];
      }
    } else if (error.status == 401) {
      this.InvalidError = "Invalid username or password. Please try again.";
    }
  }
  onSubmit(form: NgForm) {
    if (!this.isLogin) {
      this.authService.Register(
        form.controls["username"].value,
        form.controls["email"].value,
        form.controls["password"].value
      ).subscribe({
        next: (response: UserData) => {
          localStorage.setItem("userToken", response.token);
          localStorage.setItem("userId", response.id);
          location.reload()
        },
        error: (error) => {
          this.errorHandling(error.error)
        },
        complete: () => {
          console.log('Request complete.');
        }}
      )
    } else {
      this.authService.Login(
        form.controls["username"].value,
        form.controls["password"].value
      ).subscribe({
        next: (response: UserData) => {
          localStorage.setItem("userToken", response.token);
          localStorage.setItem("userId", response.id);
          location.reload()
        },
        error: (error) => {
          this.errorHandling(error.error)
        },
        complete: () => {
          console.log('Request complete.');
        }}
      )
    }
  }
  switchToRegister() {
    this.isLogin = false;
  }
}

