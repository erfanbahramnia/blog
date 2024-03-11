import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { AuthResponse } from "../dtos/auth.dto";
import { UserRegister } from "../dtos/auth.input";
import { AuthService } from "../service/auth.service";

@Resolver(of => AuthResponse)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Mutation(returns => AuthResponse)
    async register(@Args("user") userData: UserRegister) {
        return this.authService.register(userData);
    };

    @Query(returns => AuthResponse)
    async login(
        @Args("username") username: string,
        @Args("password") password: string
    ) {
        return this.authService.login(username, password);
    }
}