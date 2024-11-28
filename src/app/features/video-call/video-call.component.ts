import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Peer } from 'peerjs';
// import { SignalRService } from '../../core/services/signal-r.service';
// import { WebRTCService } from '../../core/services/web-rtc.service';
import { Subscription } from 'rxjs';
interface Signal {
  type: 'offer' | 'answer' | 'candidate';
  sdp?: string;        // Optional: Present for 'offer' and 'answer' types
  candidate?: object;  // Optional: Present for 'candidate' type
}
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent {

  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;


  private senderId = localStorage.getItem("userId") as string;
  private peer!: Peer;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  private currentCall: any;
  peerID: any;
  destPeerID: any;
  @ViewChild('chat', { static: false }) chat!: ElementRef;
  @ViewChild('message', { static: false }) message!: ElementRef;

  @ViewChild('localVideo', { static: false }) localVideoElement!: HTMLVideoElement;
  @ViewChild('remoteVideo', { static: false }) remoteVideoElement!: HTMLVideoElement;

  constructor(
    // private signalRService: SignalRService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.params.subscribe(
    //   params => {
    //     this.destPeerID = params['peerID'];
    //   }
    // )
  // PeerJs
  this.peer = new Peer().on('open', id =>{
    this.peerID = id;
  });

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    this.localStream = stream;
    console.log(this.localStream);

    this.localVideoElement.srcObject = stream; // Display local stream
  })
  .catch(err => console.error("Failed to get media:", err));
   // Listen for incoming calls
    this.peer.on('call', (call) => {
    // Answer incoming call
    call.answer(this.localStream);
    call.on('stream', (remoteStream) => {
      this.remoteStream = remoteStream;
      this.remoteVideoElement.srcObject = remoteStream; // Display remote stream
    });

    this.currentCall = call;
  });
  }
  startCall(): void {
    // Call a peer with the ID `peerId`
    const call = this.peer.call(this.destPeerID, this.localStream);
    call.on('stream', (remoteStream) => {
      this.remoteStream = remoteStream;
      this.remoteVideoElement.srcObject = remoteStream; // Display remote stream
    });

    this.currentCall = call;
  }

  endCall(): void {
    if (this.currentCall) {
      this.currentCall.close();
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
}
