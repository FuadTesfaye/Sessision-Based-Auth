import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(email: string, passwordHash: string, role: string): Promise<User> {
        const user = new this.userModel({ email, passwordHash, role });
        return user.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async count(): Promise<number> {
        return this.userModel.countDocuments().exec();
    }

    async updateRole(id: string, role: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }
}
