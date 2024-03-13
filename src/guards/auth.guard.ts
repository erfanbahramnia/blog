import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { userTokenData } from "src/interface/user.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)        
        // get req
        const req: Request = ctx.getContext().req;
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
            req["user"] = user;
            // success
            return true;
        } catch (error) {
            // unsuccessful
            throw new UnauthorizedException("Please login to your account");
        }
    }
}