import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peerIdSubject = new BehaviorSubject<string>(''); // my peerId
  private distPeerIdSubject = new BehaviorSubject<string>(''); // remote peerId

  peerId$ = this.peerIdSubject.asObservable();
  distPeerId$ = this.distPeerIdSubject.asObservable();

  constructor() {}

  updatePeerId(peerId: string): void {
    this.peerIdSubject.next(peerId);
  }

  getPeerId(): string {
    return this.peerIdSubject.getValue();
  }

  updateDistPeerId(peerId: string): void {
    console.log('dist peer id received:', peerId);
    this.distPeerIdSubject.next(peerId); // ✅ fixed
  }

  getDistPeerId(): string {
    return this.distPeerIdSubject.getValue();
  }
}
