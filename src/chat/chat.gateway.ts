import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) {}

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
        client.join(roomId);
        const messages = await this.chatService.getMessagesByRoom(roomId);
        client.emit('chatHistory', messages);
    }

  
    @SubscribeMessage('sendMessage')
    async handleMessage(
      @MessageBody()
      data: {
        roomId: string;
        senderId: string;
        senderName: string;
        message: string;
      },
      @ConnectedSocket() client: Socket,
    ) {
      const saved = await this.chatService.saveMessage(data);
      this.server.to(data.roomId).emit('newMessage', saved); // broadcast ke semua termasuk pengirim
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
      client.leave(roomId);
    }
  }
  