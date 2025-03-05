import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  Register(username: string, email: string, password: string) {
    // const formData = new FormData();
    // formData.append('name', username);
    // formData.append('email', email);
    // formData.append('password', password);
    return this.http.post<UserData>("https://crud-1a1m.onrender.com/api/v1/auth/register",
    {
      name: username,
      email: email,
      password: password
    }
  )
  }
  Login(username: string, password: string) {
    // Send As form-data
    // const formData = new FormData();
    // formData.append('Username', username);
    // formData.append('Password', password);
    return this.http.post<UserData>("https://crud-1a1m.onrender.com/api/v1/auth/login",
    {
      email: username,
      password: password
    }
    )
  }
  getAllUsers(){
    return this.http.get(`https://crud-1a1m.onrender.com/api/v1/users`);
  }
  getUserId(id: string){
    return this.http.get(`https://crud-1a1m.onrender.com/api/v1/users/${id}`);
  }
}
