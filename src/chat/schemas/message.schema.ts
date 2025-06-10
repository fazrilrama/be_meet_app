import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop() roomId: string;
  @Prop() senderId: string;
  @Prop() senderName: string;
  @Prop() message: string;
  @Prop({ default: 'text' }) type: string;
  @Prop({ default: Date.now }) createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
