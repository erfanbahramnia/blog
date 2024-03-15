import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class DeveloperService {
    constructor(
        private readonly userService: UserService
    ) {}

    async changeUserRole(id: number, role: string) {
        return this.userService.changeUserRole(id, role);
    }

    async getUserInfoByUsername(username: string) {
        return this.userService.getFullUserInfoByUsername(username)
    }
}