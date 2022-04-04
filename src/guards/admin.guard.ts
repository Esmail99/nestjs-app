import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // return request.currentUser?.admin;
    return request.currentUser; // TODO: allow admins only here!
  }
}
