import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Peer } from 'peerjs';
// import { SignalRService } from '../../core/services/signal-r.service';
// import { WebRTCService } from '../../core/services/web-rtc.service';
import { Subscription } from 'rxjs';
import { PeerService } from '../../core/services/peer.service';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent {
  private senderId = localStorage.getItem('userId') as string;
  private peer!: Peer;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  private currentCall: any;
  peerID: any;
  destPeerID: any;
  @ViewChild('chat', { static: false }) chat!: ElementRef;
  @ViewChild('message', { static: false }) message!: ElementRef;

  @ViewChild('localVideo', { static: false }) localVideo!: ElementRef<any>;
  @ViewChild('remoteVideo', { static: false }) remoteVideo!: ElementRef<any>;
  @Output() closeVideoCallDrawer: EventEmitter<any> = new EventEmitter();
  constructor(
    // private signalRService: SignalRService,
    private route: ActivatedRoute,
    private peerService: PeerService
  ) {}
  private DistPeerIdSubscription!: Subscription;

  ngOnInit() {
    // 1. Setup peer
    this.peer = new Peer().on('open', (id) => {
      this.peerID = id;
      this.peerService.updatePeerId(this.peerID);
    });

    // 2. Get local media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        const videoElement = this.localVideo.nativeElement;
        videoElement.srcObject = stream;
        videoElement.muted = true;
        videoElement
          .play()
          .catch((err: any) =>
            console.error('Error playing local video:', err)
          );
      })
      .catch((err) => console.error('Error accessing media devices:', err));

    // 3. Subscribe for remote peerId AFTER peer & localStream are ready
    this.DistPeerIdSubscription = this.peerService.distPeerId$.subscribe(
      (peerId) => {
        if (peerId && peerId !== this.peerID && this.localStream) {
          // console.log('Dist peerId:', peerId);
          this.startCall(peerId);
          this.destPeerID = peerId;
        }
      }
    );

    // 4. Handle incoming calls
    this.peer.on('call', (call) => {
      call.answer(this.localStream);
      call.on('stream', (remoteStream) => {
        this.remoteStream = remoteStream;
        const videoElement = this.remoteVideo.nativeElement;
        videoElement.srcObject = remoteStream;
      });
      this.currentCall = call;
    });
  }

  startCall(distPeerID: string): void {
    // console.log('start-call destID', distPeerID);

    // Call a peer with the ID `peerId`
    const call = this.peer.call(distPeerID, this.localStream);
    // console.log(call);
    call.on('stream', (remoteStream) => {
      this.remoteStream = remoteStream;
      const videoElement = this.remoteVideo.nativeElement;
      videoElement.srcObject = remoteStream;
      // this.remoteVideoElement.srcObject = remoteStream; // Display remote stream
    });

    this.currentCall = call;
  }

  endCall(): void {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
      this.closeVideoCallDrawer.emit();
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteVideo.nativeElement.srcObject = null; // ✅ clear
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localVideo.nativeElement.srcObject = null; // ✅ clear
    }
  }

  ngOnDestroy() {
    if (this.DistPeerIdSubscription) {
      this.DistPeerIdSubscription.unsubscribe();
    }
  }
}
