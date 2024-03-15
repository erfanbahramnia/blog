// nestjs
import { Injectable } from "@nestjs/common";
// services
import { ArticleService } from "src/article/service/article.service";
import { UserService } from "src/user/service/user.service";
// inrefaces
import { UserFormalData } from "src/interface/user.interface";

@Injectable()
export class AdminService {
    constructor(
        private readonly userService: UserService,
        private readonly articleService: ArticleService
    ) {}

    async getUsers(): Promise<UserFormalData[]> {
        return await this.userService.getUsers();
    }

    async getPendingArticles() {
        return await this.articleService.getPendingArticles();
    }

    async changeArticleStatus(status: string, id: number) {
        return await this.articleService.changeArticleStatus(status, id);
    }
}