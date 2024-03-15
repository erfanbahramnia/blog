import { Module } from "@nestjs/common";
import { ArticleService } from "./service/article.service";
import { ArticleResolver } from "./resolver/articlae.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "./entity/article.entity";
import { UserModule } from "src/user/user.module";

@Module({
    providers: [
        ArticleService,
        ArticleResolver,
    ],
    imports: [
        TypeOrmModule.forFeature([
            ArticleEntity
        ]),
        UserModule
    ]
})
export class ArticleModule {}