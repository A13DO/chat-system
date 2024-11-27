// import { Injectable } from '@angular/core';
// import { SignalRService } from './signal-r.service';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebRTCService {
//   constructor(private signalRService: SignalRService) { }
//   private remoteStreamSubject: Subject<MediaStream> = new Subject<MediaStream>();

//   // ICE
//   private receiverId = '601fef65-dc71-41c6-b290-990992fa84cd';
//   private configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' }, // Google's STUN server
//     ],
//   };
//   private peerConnection!: RTCPeerConnection;
//   private handleRemoteStream(remoteStream: MediaStream) {
//     console.log('Remote stream:', remoteStream);
//     this.remoteStreamSubject.next(remoteStream); // Emit the remote stream to subscribers
//   }
//   getRemoteStream$() {
//     return this.remoteStreamSubject.asObservable();
//   }
//   // #1 init Peer connection
//   initializePeerConnection() {
//     this.peerConnection = new RTCPeerConnection(this.configuration);
//     console.log(this.peerConnection);
//   // #2 onicecandidate: generate ICE
//     this.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//       // Send ICE candidate to the remote peer
//         this.signalRService.sendSignal(this.receiverId, JSON.stringify({
//           type: 'candidate',
//           candidate: event.candidate,
//         }));
//       }
//     };
//   // #3 ontrack: pull tracks from RemoteStream, add to video stream
//   this.peerConnection.ontrack = (event) => {
//     console.log('Remote track received:', event.streams[0]);
//       // Attach the remote stream to a <video> element
//       const remoteStream = event.streams[0];

//     };
//   }
//   // #4 addLocalStream: push tracks from localStream to peerConnection
//   addLocalStream(stream: MediaStream) {
//     stream.getTracks().forEach((track) => {
//       this.peerConnection.addTrack(track, stream);
//     });
//   }
//   // #5 createOffer:
//   async createOffer() {
//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(offer);
//     return offer;
//   }
//   // #6 createAnswer:
//   async createAnswer() {
//     const answer = await this.peerConnection.createAnswer();
//     await this.peerConnection.setLocalDescription(answer);
//     return answer;
//   }
//   setRemoteDescription(sdp: RTCSessionDescriptionInit) {
//     return this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
//   }

//   addIceCandidate(candidate: RTCIceCandidateInit) {
//     return this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//   }

//   getPeerConnection() {
//     return this.peerConnection;
//   }
// }
