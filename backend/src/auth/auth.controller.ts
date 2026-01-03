import { Controller, Post, Body, Session, HttpCode, Get, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: any, @Session() session: Record<string, any>) {
        const user = await this.authService.register(body.email, body.password);
        session.userId = (user as any).id;
        session.role = (user as any).role;
        return user;
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() body: any, @Session() session: Record<string, any>) {
        const user = await this.authService.login(body.email, body.password);
        session.userId = (user as any).id;
        session.role = (user as any).role;
        return user;
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@Session() session: Record<string, any>, @Res() res: Response) {
        session.destroy((err: any) => {
            if (err) return res.status(500).json({ error: 'Logout failed' });
            res.clearCookie('connect.sid');
            return res.json({ message: 'Logged out successfully' });
        });
    }
}
