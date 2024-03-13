import { Query, Resolver } from "@nestjs/graphql";
import { UserDataDto } from "../dtos/admin.dto";
import { AdminService } from "../service/admin.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Resolver()
export class AdminResolver {
    constructor(
        private readonly adminService: AdminService
    ) {}

    @Query(returns => [UserDataDto])
    async getUsers() {
        return await this.adminService.getUsers();
    }
}