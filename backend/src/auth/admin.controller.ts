import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
    constructor(private usersService: UsersService) { }

    @Get('users')
    async findAll() {
        return this.usersService.findAll();
    }

    @Patch('users/:id/role')
    async updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.usersService.updateRole(id, role);
    }
}
