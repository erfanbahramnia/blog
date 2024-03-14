import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Roles } from "src/decorator/role.decorator";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        // get roles that can access to that handler
        const roles = this.reflector.get(Roles, ctx.getHandler());
        // get user role
        const { user } = await GqlExecutionContext.create(ctx).getContext();
        const { role: userRole } = await this.userService.findUserById(user.id)
        console.log(userRole);
        console.log(roles);
        
        // check access
        for (const validRole of roles) {
            // success
            if (validRole === userRole)
                return true;
        };
        // fail
        throw new ForbiddenException("Access denied!");
    };
}