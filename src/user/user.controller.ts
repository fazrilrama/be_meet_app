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

    @Get('type_request')
    list_type_request() {
        const type = [
            {
                id: 1,
                name: 'approve'
            },
            {
                id: 2,
                name: 'reject'
            }
        ];


        return {
            status: 200,
            message: 'SUCCESS_GET_TYPE',
            data: type
        };
    }

    @Post('approval')
    user_approval(@Req() req: Request, @Body('user_id') user_id?: number, @Body('type') type?: number) {
        const user = req['user'];
        return this.UserService.approval_user(user_id, type);
    }

}