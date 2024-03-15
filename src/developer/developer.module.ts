import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { UserService } from "src/user/service/user.service";
import { UserModule } from "src/user/user.module";
import { DeveloperService } from "./developer.service";
import { DeveloperResolver } from "./developer.resolver";

@Module({
    imports: [
        UserModule,
    ],
    providers: [
        DeveloperService,
        DeveloperResolver
    ]
})
export class DeveloperModule {}