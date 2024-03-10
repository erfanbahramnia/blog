import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { AuthResolver } from "./resolver/auth.resolver";
import { AuthService } from "./service/auth.service";

@Module({
    imports: [
        UserModule
    ],
    providers: [
        AuthResolver,
        AuthService
    ]
})
export class AuthModule {};