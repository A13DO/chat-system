import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketIOService } from '../../core/services/socket-io.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [HttpClientModule],
  providers: [AuthService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  constructor(private authService: AuthService,
    private router: Router,
    private socketIOService: SocketIOService) {

  }
  users: any;
  filteredUsers: any[] = []; // List of users excluding the sender
  SenderId!: string;
  ReceiverId!: string;
  RoomId!: string;
  ngOnInit(): void {
    this.SenderId = localStorage.getItem("userId") as string;
    this.authService.getAllUsers().subscribe(
      reposnseData => {
        console.log(reposnseData);
        this.users = reposnseData;
        this.filteredUsers = this.users.filter((user: any) => user._id !== this.SenderId);
      }
    )
  }
  async startChat(user: any) {
    await this.router.navigate(['chat-room', user._id]);
    location.reload()
    this.RoomId = this.socketIOService.createRoomId(this.SenderId, user._id)
    this.socketIOService.joinRoom(this.RoomId)
  }
}
