import { Controller, Post, Body, UnauthorizedException, Req, Get, Query, Delete } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantDto } from './dto/participant_dto';

@Controller('participant')
export class ParticipantController {
    constructor(private readonly ParticipantService: ParticipantService) {}
    
    @Post()
    async create(@Body() body: ParticipantDto) {
        return this.ParticipantService.create_participant(body);    
    }

    @Post('approve')
    async approve(
        @Body('id') id?: number,
        @Body('type') type?: number
    ) {
        if(!id) {
            return {
                status: false,
                message: 'Request id is required!'
            };
        }

        return this.ParticipantService.approved(id, type);
    }

    @Get()
    async list(
        @Query('type') type?: number,
        @Query('meeting_id') meeting_id?: number
    ) {

        if(!meeting_id) {
            return {
                status: false,
                message: 'Request meeting_id is required!'
            };
        }

        return this.ParticipantService.list_participant(meeting_id, type);
    }

    @Delete() 
    async remove(@Query('id') id?: number) {
        if(!id) {
            return {
                status: false,
                message: 'ID Tidak terdaftar'
            };
        }
        return this.ParticipantService.remove_meeting(id);
    }
}