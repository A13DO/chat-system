// import { SignalRService } from './../../core/services/signal-r.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { HeaderComponent } from '../../core/header/header.component';
import { SocketIOService } from '../../core/services/socket-io.service';
import { CommonModule } from '@angular/common';
import { Peer } from 'peerjs';
import { VideoCallComponent } from '../video-call/video-call.component';
import { PeerService } from '../../core/services/peer.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
export interface Message {
  text: string;
  fromUsrId: string;
  toUsrId: string;
  timeStamp: Date;
}
@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    UserListComponent,
    MatButtonModule,
    MatSidenavModule,
    HeaderComponent,
    CommonModule,
    VideoCallComponent,
    HttpClientModule,
  ],
  providers: [SocketIOService, AuthService],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private socketIOService: SocketIOService,
    private peerService: PeerService
  ) {}
  readonly DEFAULT: string = 'default';
  userId: string | undefined;
  SenderId!: string;
  ReceiverId!: string;
  RoomId!: string;
  myPeerId!: string;
  showFiller = false;
  chatPartnerData: any = [];

  // distPeerId: string = "";
  messagesHistory: any = [];
  saveMessage!: Message;
  chatMsg: string | undefined;
  private peer!: Peer;
  private currentCall: any;
  @ViewChild('chat', { static: false }) chat!: ElementRef;
  @ViewChild('message', { static: false }) message!: ElementRef;
  isVideoCall: boolean = false;
  private peerIdSubscription!: Subscription;
  private routeParamSubscription!: Subscription;
  private routeParamMapSubscription!: Subscription;
  private socketMessageSubscription!: Subscription;

  ngOnInit(): void {
    // let messages: Message[] = [];
    this.SenderId = localStorage.getItem('userId') as string;

    // this.routeParamSubscription =
    // this.route.params.subscribe(
    //   params => {
    //     this.ReceiverId = params['id'] || this.DEFAULT;
    //     console.log(this.ReceiverId);
    //   }
    // )
    this.routeParamMapSubscription = this.route.paramMap.subscribe((params) => {
      this.ReceiverId = params.get('id') || this.DEFAULT;
      this.onGetUserbyId(this.ReceiverId);
    });
    // get Room ID
    this.RoomId = this.socketIOService.createRoomId(
      this.SenderId,
      this.ReceiverId
    );
    // get Peer ID for video call
    this.peerIdSubscription = this.peerService.peerId$.subscribe((peerId) => {
      this.myPeerId = peerId;
      // console.log('Received peerId:', peerId);
      this.onJoinRoom(this.RoomId, this.myPeerId);
    });
    // Join Room
    this.socketMessageSubscription = this.socketIOService
      .getMessages(this.RoomId)
      .subscribe((responseData: any) => {
        this.messagesHistory = responseData;
        Object.entries(responseData).forEach(([key, message]) => {
          this.displayMessage(message as Message);
        });
      });
    this.socketIOService.on('chat-room', (data: any) => {
      this.displayMessage(data);
    });

    this.socketIOService.on('newPeer', (data: any) => {
      // if (!this.loggedNewPeer) {
      //   console.log('New peer connected data:', data);
      //   console.log('New peer connected:', data.peerId);
      //   this.loggedNewPeer = true; // 👈 mark as logged
      // }

      if (data && data.peerId) {
        this.peerService.updateDistPeerId(data.peerId); // Update peerId in service
      } else {
        console.error('PeerId not found in data:', data);
      }
    });
    // send Send this to app-video as DistPeer Id
    // and startCall()to receive open the call with call partner
  }
  private loggedNewPeer = false; // 👈 add this in your component

  onJoinRoom(roomId: string, peerId: string) {
    // console.log("from onJoinRoom:", roomId, "peerID:", peerId);

    this.socketIOService.joinRoom(roomId, peerId);
  }

  // Chat Logic
  onSendMessage() {
    const messageText = this.message.nativeElement.value.trim();

    if (!messageText) {
      return;
    }
    const newMessage: Message = {
      text: this.message.nativeElement.value,
      fromUsrId: this.SenderId,
      toUsrId: this.ReceiverId,
      timeStamp: new Date(),
    };
    this.socketIOService.saveMessages(this.RoomId, newMessage);
    this.socketIOService.sendMessage(this.RoomId, newMessage);
    this.message.nativeElement.value = '';
  }

  displayMessage(message: Message) {
    let newMessage = document.createElement('p');
    newMessage.textContent = message.text;
    newMessage.classList.add('chat-message');

    if (message.fromUsrId === this.SenderId) {
      newMessage.style.textAlign = 'right';
      newMessage.style.backgroundColor = '#7678ed';
      newMessage.style.margin = '5px 0 5px auto';
      newMessage.style.color = 'white';
    } else {
      newMessage.style.textAlign = 'left';
      newMessage.style.backgroundColor = '#eeeef8';
      newMessage.style.margin = '5px auto 5px 0';
    }
    /* #eeeef8 grey: reciver msg*/
    /* #7678ed purple: sender msg*/
    // common
    newMessage.style.padding = '10px';
    newMessage.style.borderRadius = '10px';
    newMessage.style.maxWidth = '80%';
    newMessage.style.textWrap = 'break-word';
    newMessage.style.fontWeight = 'normal';

    this.chat.nativeElement.appendChild(newMessage);
  }
  videoCallToggle() {
    if (this.isVideoCall == true) {
      this.isVideoCall = false;
    } else {
      this.isVideoCall = true;
    }
  }
  onGetUserbyId(userId: any) {
    this.authService.getUserId(userId).subscribe({
      next: (res) => {
        // console.log(res);
        this.chatPartnerData = res;
      },
    });
  }
  ngOnDestroy() {
    if (this.peerIdSubscription) {
      this.peerIdSubscription.unsubscribe();
    }
    if (this.routeParamSubscription) {
      this.routeParamSubscription.unsubscribe();
    }
    if (this.routeParamMapSubscription) {
      this.routeParamMapSubscription.unsubscribe();
    }
    if (this.socketMessageSubscription) {
      this.socketMessageSubscription.unsubscribe();
    }
    this.socketIOService.disconnect();
  }
}
