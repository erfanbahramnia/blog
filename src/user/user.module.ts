import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserResolver } from "./resolver/user.resolver";
import { ArticleModule } from "src/article/article.module";

@Module({
    providers: [
        UserService,
        UserResolver
    ],
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ]),
        forwardRef(() => ArticleModule)
    ],
    exports: [
        UserService,
    ]
})
export class UserModule {}