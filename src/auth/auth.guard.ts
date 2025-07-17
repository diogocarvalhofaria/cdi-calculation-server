import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constantes';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private jwtService: JwtService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      request = GqlExecutionContext.create(context).getContext().req;
    }

    const token = this.extractTokenFromHeader(request);

    if(!token) {
      throw new UnauthorizedException;
    }

    try{
      const payload = await this.jwtService.verifyAsync(token,
      {
        secret: jwtConstants.secret
      }
      );
      request['user'] = payload;
    }catch{
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }


}