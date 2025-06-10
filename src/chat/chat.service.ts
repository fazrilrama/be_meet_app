import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private msgModel: Model<Message>) {}

  async saveMessage(data: any): Promise<Message> {
    const created = new this.msgModel(data);
    return created.save();
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.msgModel.find({ roomId }).sort({ createdAt: 1 }).exec();
  }
}