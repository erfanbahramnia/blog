import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DeveloperService } from "./developer.service";
import { ChangeRoleResponse } from "./developer.dto";
import { UserEntity } from "src/user/entity/user.entity";

@Resolver()
export class DeveloperResolver {
    constructor(
        private readonly developerService: DeveloperService
    ) {}

    @Mutation(returns => ChangeRoleResponse)
    async changeUserRole(
        @Args("userId", {type: () => Int}) id: number,
        @Args("role") role: string
    ) {
        return this.developerService.changeUserRole(id, role);
    }

    @Query(() => UserEntity)
    async getUserInfoByUsername(
        @Args("username") username: string
    ) {
        return this.developerService.getUserInfoByUsername(username)
    }
}