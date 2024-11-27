import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Message } from '../../features/chat-room/chat-room.component';


@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    // Replace with your server URL
    this.socket = io('https://crud-1a1m.onrender.com');
    this.socket.on('connect', () => {
      console.log(`You connected with id`);
  })
  }
  // Emit an event
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Listen for an event
  on(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }
  // create room Id
  createRoomId(user1Id: string, user2Id: string): string {
    // Ensure consistent room ID
    return [user1Id, user2Id].sort().join('_');
  }
  // join Room With Chat Partner
  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }
  // Send Message To Room
  sendMessage(roomId: string, message: Message): void {
    this.socket.emit('chat-room', roomId, message);
  }
  getMessages(roomId: string) {
    return this.http.get<Message[]>(`https://chat-system-13f60-default-rtdb.europe-west1.firebasedatabase.app/${roomId}/messages.json`)
  }
  saveMessages(roomId: string, message: Message) {

    this.http.post<any>(`https://chat-system-13f60-default-rtdb.europe-west1.firebasedatabase.app/${roomId}/messages.json`, message).subscribe()
  }
  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
