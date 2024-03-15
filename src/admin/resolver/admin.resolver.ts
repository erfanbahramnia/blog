// nestjs
import { UseGuards } from "@nestjs/common";
// graphql
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserDataDto } from "../dtos/admin.dto";
import { GetArticles } from "../dtos/admin.object-type";
// guards
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
// services
import { AdminService } from "../service/admin.service";
// decorators
import { Roles } from "src/decorator/role.decorator";
// enums
import { ArticleStatusEnum, RolesEnum } from "src/constants/constants";
import { SimpleResponse } from "src/article/dto/article.object-type";


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
    @Query(returns => [GetArticles])
    async getPendingArticles() {
        const status = ArticleStatusEnum.Pending
        return await this.adminService.getPendingArticlesByStatus(status);
    };

    @Roles([RolesEnum.Admin])
    @Query(returns => [GetArticles])
    async getAcceptedArticles() {
        const status = ArticleStatusEnum.Accepted
        return await this.adminService.getPendingArticlesByStatus(status);
    };

    @Roles([RolesEnum.Admin])
    @Query(returns => [GetArticles])
    async getRejectedArticles() {
        const status = ArticleStatusEnum.Rejected
        return await this.adminService.getPendingArticlesByStatus(status);
    };

    @Roles([RolesEnum.Admin])
    @Mutation(returns => SimpleResponse)
    async changeArticleStatus(
        @Args("status") status: string,
        @Args("articleId", {type: () => Int}) id: number,
    ) {
        return await this.adminService.changeArticleStatus(status, id)
    }

    @Roles([RolesEnum.Admin])
    @Mutation(returns => SimpleResponse)
    async deleteArticleById(
        @Args("articleId", {type: () => Int}) id: number,
    ) {
        return await this.adminService.deleteArticleById( id );
    };
}