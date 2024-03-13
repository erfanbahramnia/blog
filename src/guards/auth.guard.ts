// nestjs
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// graphqo
import { GqlExecutionContext } from "@nestjs/graphql";
// configs
import { JwtService } from "@nestjs/jwt";
import { userTokenData } from "src/interface/user.interface";
// express
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext()        
        // get req
        const req: Request = ctx.req;
        // check authorize
        const { authorization } = req.headers;
        if(!authorization || !authorization.trim())
            throw new UnauthorizedException("Please login to your account")
        // get token
        const token = authorization.replace(/bearer/gim, "").trim()
        if(!token)
            throw new UnauthorizedException("Please login to your account")
        // validate token
        try {
            // get user data
            const user: userTokenData = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>("JWT_SECRET")});
            // save user info
            ctx.user = user;
            // success
            return true;
        } catch (error) {
            // unsuccessful
            throw new UnauthorizedException("Please login to your account");
        }
    };
}