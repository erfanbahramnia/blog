import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { userTokenData } from "src/interface/user.interface";
import { IUserRepo, IuserData } from "src/user/interface/user.interface";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {};

    async register(userData: IuserData) {
        const result = await this.userService.createNewUser(userData);
        const token = this.generateToken(result.user)
        return {
            ...result,
            token
        }
    };

    async login(username: string, password: string) {
        const result = await this.userService.findUserByPassAndUsername(username, password);
        const token = await this.generateToken(result.user);
        return {
            ...result,
            token
        }
    }

    private async generateToken(user: userTokenData): Promise<string> {
        const payload = {
            email: user.email,
            username: user.username
        };
        return await this.jwtService.signAsync(payload, { secret: this.configService.get<string>("JWT_SECRET"), expiresIn: "3600s" })
    };
}