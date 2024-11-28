import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private peerIdSubject = new BehaviorSubject<string>('');
  private distPeerIdSubject = new BehaviorSubject<string>('');
  peerId$ = this.peerIdSubject.asObservable(); // Observable to subscribe to
  distPeerId$ = this.distPeerIdSubject.asObservable(); // Observable to subscribe to

  constructor() {}

  updatePeerId(peerId: string): void {
    this.peerIdSubject.next(peerId);
  }

  getPeerId(): string {
    return this.peerIdSubject.getValue();
  }
  updateDistPeerId(peerId: string): void {
    this.peerIdSubject.next(peerId);
  }

  getDistPeerId(): string {
    return this.peerIdSubject.getValue();
  }
}
