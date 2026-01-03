import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.session?.role !== 'admin') {
            throw new ForbiddenException('Forbidden: Admin access required');
        }
        return true;
    }
}
