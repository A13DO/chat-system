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
  SenderId!: string;
  ReceiverId!: string;
  RoomId!: string;
  ngOnInit(): void {
    this.SenderId = localStorage.getItem("userId") as string;
    this.authService.getAllUsers().subscribe(
      reposnseData => {
        this.users = reposnseData;
      }
    )
  }
  async startChat(user: any) {
    await this.router.navigate(['chat-room', user.id]);
    location.reload()
    this.RoomId = this.socketIOService.createRoomId(this.SenderId, user.id)
    this.socketIOService.joinRoom(this.RoomId)
  }
}
