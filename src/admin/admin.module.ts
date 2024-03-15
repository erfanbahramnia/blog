// nestjs
import { Module } from "@nestjs/common";
// providers
import { AdminResolver } from "./resolver/admin.resolver";
import { AdminService } from "./service/admin.service";
// modules
import { UserModule } from "src/user/user.module";
import { ArticleModule } from "src/article/article.module";

@Module({
    imports: [
        UserModule,
        ArticleModule
    ],
    providers: [
        AdminResolver,
        AdminService
    ]
})
export class AdminModule {}