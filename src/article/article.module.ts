// nestjs
import { Module, forwardRef } from "@nestjs/common";
// typeorm
import { TypeOrmModule } from "@nestjs/typeorm";
// emtities
import { ArticleEntity } from "./entity/article.entity";
// providers
import { ArticleService } from "./service/article.service";
import { ArticleResolver } from "./resolver/articlae.resolver";
// modules
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
        forwardRef(() => UserModule)
    ],
    exports: [
        ArticleService
    ]
})
export class ArticleModule {}