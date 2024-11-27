import { AuthComponent } from './core/auth/auth.component';
import { Routes } from '@angular/router';
import { ChatRoomComponent } from './features/chat-room/chat-room.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedinGuard } from './core/guards/loggedin.guard';
import { VideoCallComponent } from './features/video-call/video-call.component';


export const routes: Routes = [
  { path: "auth", component: AuthComponent, canActivate: [LoggedinGuard] },

  { path: "", redirectTo: 'chat-room/default', pathMatch: "full"},
  { path: "chat-room", redirectTo: 'chat-room/default', pathMatch: "full"},
  { path: "chat-room/:id",
  component: ChatRoomComponent,
  canActivate: [AuthGuard]
},
{ path: "**", redirectTo: 'chat-room/default', pathMatch: "full"},

];
