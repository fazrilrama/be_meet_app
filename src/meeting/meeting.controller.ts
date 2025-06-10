import { Controller, Post, Body, UnauthorizedException, Req, Get, Query } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingDto } from './dto/meeting_dto';

@Controller('meeting')
export class MeetingController {
    constructor(private readonly MeetingService: MeetingService) {}

    @Post()
    async create(@Body() body: MeetingDto, @Req() req: Request) {
        const userId = req['user']?.sub;
        return this.MeetingService.create_meeting(body, userId);
    }

    @Get() 
    getMeetings(
        @Req() req: Request,
        @Query('meeting_code') meeting_code?: string,
    ) {
        const userId = req['user']?.sub; 
        return this.MeetingService.list_meeting({ meeting_code, user_id: userId });
    }
}