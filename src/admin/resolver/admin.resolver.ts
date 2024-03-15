// nestjs
import { UseGuards } from "@nestjs/common";
// graphql
import { Query, Resolver } from "@nestjs/graphql";
import { UserDataDto } from "../dtos/admin.dto";
import { GetPendingArticles } from "../dtos/admin.object-type";
// guards
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
// services
import { AdminService } from "../service/admin.service";
// decorators
import { Roles } from "src/decorator/role.decorator";
// enums
import { RolesEnum } from "src/constants/constants";


@UseGuards(AuthGuard, RoleGuard)
@Resolver()
export class AdminResolver {
    constructor(
        private readonly adminService: AdminService,
    ) {}

    @Roles([RolesEnum.Admin])
    @Query(returns => [UserDataDto])
    async getUsers() {
        return await this.adminService.getUsers();
    };

    @Roles([RolesEnum.Admin])
    @Query(returns => [GetPendingArticles])
    async getPendingArticles() {
        return await this.adminService.getPendingArticles();
    };
}