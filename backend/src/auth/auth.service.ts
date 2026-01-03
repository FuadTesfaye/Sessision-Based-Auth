import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async register(email: string, password: string) {
        const existing = await this.usersService.findByEmail(email);
        if (existing) throw new BadRequestException('User already exists');

        const count = await this.usersService.count();
        const role = count === 0 ? 'admin' : 'user';
        const hash = await bcrypt.hash(password, 10);

        return this.usersService.create(email, hash, role);
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
}
