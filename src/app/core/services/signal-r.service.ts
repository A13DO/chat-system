
// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';

// @Injectable({
//   providedIn: 'root',
// })
// export class SignalRService {
//   private hubConnection!: signalR.HubConnection;
//   private videoCallHubUrl = 'https://taskflutter.runasp.net/videocallhub?userId=';
//   constructor() {
//     const SenderUserID = localStorage.getItem('userId')
//     const url = this.videoCallHubUrl + SenderUserID;
//     console.log(url);
//     // buld connection
//     this.hubConnection = new signalR.HubConnectionBuilder()
//     .withUrl(url)
//     .build();
//   }
//   // Initialize the connection
//   startVideoCallhubConnection(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.hubConnection
//         .start()
//         .then(() => {
//           console.log('SignalR connection established');
//           resolve(); // Connection established, proceed
//         })
//         .catch((err) => {
//           console.error('SignalR connection failed: ', err);
//           reject(err); // Handle failure
//         });
//     });
//   }
//   onReceiveSignal(callback: (signal: any) => void) {
//     this.hubConnection.on('ReceiveSignal', (signal) => {
//       console.log('Received Signal:', signal);
//       callback(JSON.parse(signal));
//     });
//   }
//   sendSignal(receiverId: string, signal: string): void {
//     if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
//       this.hubConnection
//         .invoke('SendSignal', receiverId, signal)
//         .then(()=> {console.log("Signal Sent Successfully.");
//         })
//         .catch((err) => console.error('Error sending signal:', err));
//     } else {
//       console.error('SignalR connection is not in the "Connected" state.');
//     }
//   }
// }
