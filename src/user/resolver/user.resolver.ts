import { Query, UseGuards } from "@nestjs/common";
import { Args, Context, GqlExecutionContext, Mutation, Resolver } from "@nestjs/graphql";
import { UpdateUserDataType, UpdateUserInfo } from "../dtos/updateUserInfo.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { UserService } from "../service/user.service";
import { userTokenData } from "src/interface/user.interface";

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ) {}

    @UseGuards(AuthGuard)
    @Mutation(returns => UpdateUserDataType)
    async updateUserInfo(@Args("user") newInfo: UpdateUserInfo, @Context("user") user: userTokenData) {
        // get user id
        const { id } = user
        // update
        return await this.userService.updateUserInfo(newInfo, id);   
    }
}