import { Module } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserResolver } from "./resolver/user.resolver";

@Module({
    providers: [
        UserService,
        UserResolver
    ],
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ])
    ],
    exports: [
        UserService,
    ]
})
export class UserModule {}