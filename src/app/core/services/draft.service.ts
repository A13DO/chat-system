
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private videoCallHubUrl = 'https://taskflutter.runasp.net/videocallhub?userId=';
  messages: string[] = []; // Store received messages

  constructor() {}

  // Initialize the connection
  startVideoCallhubConnection(SenderUserID: string) {
    if (!SenderUserID) {
      console.error('SenderUserID is required');
      return;
    }
    console.log(SenderUserID);
    console.log(this.videoCallHubUrl + SenderUserID);

    // Build the connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.videoCallHubUrl + SenderUserID)
      .build();

    // Start the connection
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connection started')

      })
      .catch((err) => console.error('SignalR Connection error:', err));

      this.hubConnection.on('ReceiveSignal', (signal: string) => {
        console.log('Received Signal:', signal);
        // You can add the signal to your message list or handle it accordingly
        this.messages.push(signal);
      });

      // Handle receiving messages
      this.hubConnection.on('ReceiveMessage', (message: string) => {
        console.log('New message received:', message);
        this.messages.push(message); // Add message to the list
      });

    // Handle receiving messages

  }

  // Send a message to the receiver
  sendMessage(ReceiverUserID: string, message: string) {
    console.log(`Sending message to ${ReceiverUserID}: ${message}`);
    this.hubConnection
      .invoke('SendMessage', ReceiverUserID, message)
      .then(() => console.log('Message sent successfully'))
      .catch((err) => console.error('Error sending message:', err));
  }
  // receiveMessage() {
  //   this.hubConnection.on('ReceiveMessage', (message) => {
  //     console.log('New message received:', message);
  //     this.messages.push(message); // Add message to the list
  //   });
  // }
  // Send a message to yourself for testing
  sendToMySelf(message: string) {
    console.log(`Sending message to yourself: ${message}`);

    // Here, you can replace the user ID with the logged-in user ID for proper functionality
    const senderUserID = '601fef65-dc71-41c6-b290-990992fa84cd'; // Example user ID

    this.hubConnection
      .invoke('SendMessage', senderUserID, message)
      .then(() => console.log('Message sent to yourself'))
      .catch((err) => console.error('Error sending message:', err));
  }
  // Send a signal to the receiver
  sendSignal(ReceiverUserID: string, signal: string) {
    console.log(`Sending signal to ${ReceiverUserID}: ${signal}`);
    this.hubConnection
      .invoke('SendSignal', ReceiverUserID, signal)
      .then(() => console.log('Signal sent successfully'))
      .catch((err) => console.error('Error sending signal:', err));
  }
  // Clean up (unsubscribe from events) when the service or component is destroyed
  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('SignalR connection stopped');
      }).catch((err) => console.error('Error stopping connection:', err));
    }
  }
}
