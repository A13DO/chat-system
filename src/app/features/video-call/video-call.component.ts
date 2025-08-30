import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Peer } from 'peerjs';
import { Subscription } from 'rxjs';
import { PeerService } from '../../core/services/peer.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  private senderId = localStorage.getItem('userId') as string;
  private peer!: Peer;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  private currentCall: any;

  peerID: string | null = null;
  destPeerID: string | null = null;

  @ViewChild('localVideo', { static: false })
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false })
  remoteVideo!: ElementRef<HTMLVideoElement>;

  @Output() closeVideoCallDrawer: EventEmitter<any> = new EventEmitter();

  @Input() isOpen!: boolean;
  private DistPeerIdSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private peerService: PeerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.startLocalStream(); // restart local camera when drawer opens
      if (!this.peer) {
        this.initPeer(); // reinit peer if destroyed
      }
    }
  }

  ngOnInit() {
    if (!this.peer) {
      this.initPeer();
    }

    this.startLocalStream();

    // Subscribe for remote peerId AFTER peer & localStream are ready
    this.DistPeerIdSubscription = this.peerService.distPeerId$.subscribe(
      (peerId) => {
        if (peerId && peerId !== this.peerID && this.localStream) {
          console.log('Dist peerId:', peerId);
          this.startCall(peerId);
          this.destPeerID = peerId;
        }
      }
    );
  }

  private startLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Stop old stream if exists
        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => track.stop());
        }

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
  }

  startCall(distPeerID: string): void {
    console.log('Calling peer:', distPeerID);

    if (!this.peer) {
      this.initPeer();
    }

    if (!this.localStream) {
      this.startLocalStream();
    }

    this._callPeer(distPeerID, this.localStream);
  }

  private _callPeer(distPeerID: string, stream: MediaStream): void {
    if (this.currentCall) {
      this.currentCall.close();
    }

    const call = this.peer.call(distPeerID, stream);

    call.on('stream', (remoteStream) => {
      this.remoteStream = remoteStream;
      this.remoteVideo.nativeElement.srcObject = remoteStream;
    });

    call.on('error', (err) => console.error('Call error:', err));

    call.on('close', () => {
      console.log('Remote call closed');
      this.closeVideoCallDrawer.emit();

      this.cleanupRemote();
    });

    this.currentCall = call;
  }

  endCall(): void {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
    }
    this.closeVideoCallDrawer.emit();

    this.cleanupRemote();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null as any;
    }
  }

  private cleanupRemote(): void {
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null as any;
    }
    if (this.remoteVideo) {
      this.remoteVideo.nativeElement.srcObject = null;
    }
  }

  private initPeer(): void {
    this.peer = new Peer().on('open', (id) => {
      this.peerID = id;
      this.peerService.updatePeerId(this.peerID);
      console.log('Peer initialized with ID:', id);
    });

    // Handle incoming calls
    this.peer.on('call', (call) => {
      call.answer(this.localStream);
      call.on('stream', (remoteStream) => {
        this.remoteStream = remoteStream;
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      });
      this.currentCall = call;
      call.on('close', () => {
        console.log('Call closed by remote');
        this.closeVideoCallDrawer.emit();

        this.cleanupRemote();
      });
    });
  }

  ngOnDestroy() {
    if (this.DistPeerIdSubscription) {
      this.DistPeerIdSubscription.unsubscribe();
    }
    this.endCall();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      // this.localStream = null as any;
    }
  }
}
