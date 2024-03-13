import { Injectable } from "@nestjs/common";
import { UserFormalData } from "src/interface/user.interface";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class AdminService {
    constructor(
        private readonly userService: UserService
    ) {}

    async getUsers(): Promise<UserFormalData[]> {
        return await this.userService.getUsers();
    }
}