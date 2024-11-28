import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  Register(username: string, email: string, password: string) {
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Email', email);
    formData.append('Password', password);
    return this.http.post<UserData>("https://taskflutter.runasp.net/api/Auth/register", formData)
  }
  Login(username: string, password: string) {
    // Send As form-data
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);
    return this.http.post<UserData>("https://taskflutter.runasp.net/api/Auth/login", formData)
  }
  getAllUsers(){
    return this.http.get(`https://taskflutter.runasp.net/api/Auth/Users`);
  }
}
