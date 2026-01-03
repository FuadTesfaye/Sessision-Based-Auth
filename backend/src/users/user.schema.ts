import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete (ret as any).passwordHash;
            delete (ret as any)._id;
            delete (ret as any).__v;
        },
    },
    toObject: { virtuals: true },
})
export class User extends Document {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ enum: ['admin', 'user'], default: 'user' })
    role: string;

    get id(): string {
        return (this as any)._id.toHexString();
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
