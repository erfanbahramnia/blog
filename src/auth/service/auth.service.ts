import { HttpStatus, Injectable } from "@nestjs/common";
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
            status: HttpStatus.CREATED,
            message: "user registered successfuly",
            user: {
                username: result.user.username,
                email: result.user.email
            },
            token
        }
    };

    async login(username: string, password: string) {
        const result = await this.userService.findUserByPassAndUsername(username, password);
        const token = await this.generateToken(result.user);
        return {
            status: HttpStatus.OK,
            message: "user founded successfuly",
            user: {
                username: result.user.username,
                email: result.user.email
            },
            token
        }
    }

    private async generateToken(user: userTokenData): Promise<string> {
        const payload = {
            email: user.email,
            username: user.username,
            id: user.id
        };
        return await this.jwtService.signAsync(payload, { secret: this.configService.get<string>("JWT_SECRET"), expiresIn: "3600s" })
    };
}