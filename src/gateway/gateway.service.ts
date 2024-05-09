import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GatewayService {

    @WebSocketServer()
    socket:Socket


    @SubscribeMessage('message')
    handleMessage(@MessageBody() body:any , @ConnectedSocket() client:Socket,payload:any){
        // console.log("client",client)
        // console.log("body",body)
        // console.log("connected client"+client.id)
        this.socket.except(client.id).emit('message',body)
        // this.socket.emit('message',body)
    }

    @SubscribeMessage('m1')
    handleM1(@MessageBody() body:any ,@ConnectedSocket() client:Socket){
        console.log("connected client" + client.id)
    }

    @SubscribeMessage('sendMessage') handleMessage1(client: Socket, payload: any) { 
        // get the socket id of the intended recipient const recipientId = payload.recipientId; 
        
        // emit an event to that socket only this.server.to(recipientId).emit('receiveMessage', payload); 
        
        }
}
