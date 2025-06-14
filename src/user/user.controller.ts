import { Controller, Post, Body, UnauthorizedException, Req, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get()
    list_user(@Req() req: Request, @Query('_id') _id?: number ) {
        if(_id) {
            const user_id = req['user'].sub;
            return this.UserService.get_by_token(user_id);
        }
        return this.UserService.list();
    }

    @Get('request')
    user_request(@Req() req: Request) {
        const user = req['user'];
        return this.UserService.get_request_user(user);
    }
}