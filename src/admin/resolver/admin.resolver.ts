import { Query, Resolver } from "@nestjs/graphql";
import { UserDataDto } from "../dtos/admin.dto";
import { AdminService } from "../service/admin.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { Roles } from "src/decorator/role.decorator";
import { RolesEnum } from "src/constants/constants";
import { RoleGuard } from "src/guards/role.guard";


@UseGuards(AuthGuard, RoleGuard)
@Resolver()
export class AdminResolver {
    constructor(
        private readonly adminService: AdminService
    ) {}

    @Roles([RolesEnum.Admin])
    @Query(returns => [UserDataDto])
    async getUsers() {
        return await this.adminService.getUsers();
    }
}