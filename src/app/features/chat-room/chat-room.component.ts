// import { SignalRService } from './../../core/services/signal-r.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { HeaderComponent } from '../../core/header/header.component';
import { SocketIOService } from '../../core/services/socket-io.service';
import { CommonModule } from '@angular/common';
import { Peer } from 'peerjs';
import { VideoCallComponent } from '../video-call/video-call.component';

export interface Message {
  text: string;
  fromUsrId: string;
  toUsrId: string;
  timeStamp: Date;
}
@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [UserListComponent, HeaderComponent, CommonModule, VideoCallComponent],
  providers: [SocketIOService],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private socketIOService: SocketIOService) {}
  readonly DEFAULT: string = 'default';
  userId: string | undefined;
  SenderId!: string;
  ReceiverId!: string;
  RoomId!: string;
  messagesHistory!: any;
  saveMessage!: Message;
  chatMsg: string | undefined;
  private peer!: Peer;
  private currentCall: any;
  @ViewChild('chat', { static: false }) chat!: ElementRef;
  @ViewChild('message', { static: false }) message!: ElementRef;
  isVideoCall: boolean = false;



  ngOnInit(): void {
    // let messages: Message[] = [];
    this.SenderId = localStorage.getItem("userId") as string;
    this.route.params.subscribe(
      params => {
        this.ReceiverId = params['id'] || this.DEFAULT;
      }
    )
    this.route.paramMap.subscribe(params => {
      this.ReceiverId = params.get('id') || this.DEFAULT;
    });
    this.RoomId = this.socketIOService.createRoomId(this.SenderId, this.ReceiverId)

    this.socketIOService.joinRoom(this.RoomId)
    this.socketIOService.getMessages(this.RoomId).subscribe(
      (responseData: any) => {
        this.messagesHistory = responseData;
        Object.entries(responseData).forEach(([key, message]) => {
          this.displayMessage(message as Message)
        });
      }
    )
    this.socketIOService.on('chat-room', (data: any) => {

      this.displayMessage(data);
    });

  }


  // Chat Logic
  onSendMessage() {
    console.log(this.message.nativeElement.value);
    const newMessage: Message = {
      text: this.message.nativeElement.value,
      fromUsrId: this.SenderId,
      toUsrId: this.ReceiverId,
      timeStamp: new Date(),
    };
    this.socketIOService.saveMessages(this.RoomId, newMessage)
    this.socketIOService.sendMessage(this.RoomId, newMessage)

  }

  displayMessage(message: Message) {
    let newMessage = document.createElement('p');
    newMessage.textContent = message.text;
    newMessage.classList.add('chat-message');

    if (message.fromUsrId === this.SenderId) {
      // Sender's message styles
      newMessage.style.textAlign = 'right';
      newMessage.style.backgroundColor = 'rgb(32 32 34)';
      newMessage.style.margin = '5px 0 5px auto';
    } else {
      // Receiver's message styles
      newMessage.style.textAlign = 'left';
      newMessage.style.backgroundColor = 'rgb(32 32 34)';
      newMessage.style.margin = '5px auto 5px 0';
    }
    // common
    newMessage.style.padding = '10px';
    newMessage.style.borderRadius = '10px';
    newMessage.style.maxWidth = '80%';
    newMessage.style.textWrap = 'break-word';
    newMessage.style.color = 'white';

    this.chat.nativeElement.appendChild(newMessage);
  }
  videoCallToggle() {
    if (this.isVideoCall == true) {
      this.isVideoCall = false
    } else {
      this.isVideoCall = true
    }
  }
  ngOnDestroy() {
    this.socketIOService.disconnect()
  }
}

