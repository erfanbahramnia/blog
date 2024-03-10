import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { AuthRegisterResponse } from "../dtos/auth.dto";
import { UserRegister } from "../dtos/auth.input";
import { AuthService } from "../service/auth.service";

@Resolver(of => AuthRegisterResponse)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Mutation(returns => AuthRegisterResponse)
    async register(@Args("user") userData: UserRegister) {
        return this.authService.register(userData);
    };

    @Query(() => String)
    async helloWorld() {
        return "Hello World"
    }
}