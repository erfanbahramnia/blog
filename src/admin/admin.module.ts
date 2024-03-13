import { Module } from "@nestjs/common";
import { AdminResolver } from "./resolver/admin.resolver";
import { AdminService } from "./service/admin.service";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        UserModule
    ],
    providers: [
        AdminResolver,
        AdminService
    ]
})
export class AdminModule {}