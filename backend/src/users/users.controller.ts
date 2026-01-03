import { Controller, Get, UseGuards, Session } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getMe(@Session() session: Record<string, any>) {
        return this.usersService.findById(session.userId);
    }
}
