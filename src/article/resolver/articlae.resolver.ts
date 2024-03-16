// nestjs
import { UseGuards } from "@nestjs/common";
// services
import { ArticleService } from "../service/article.service";
// guards
import { AuthGuard } from "src/guards/auth.guard";
// graphql
import { Args, Context, Int, Mutation, Resolver } from "@nestjs/graphql";
// garphql object type
import { SimpleResponse } from "../dto/article.object-type";
// garphql input types
import { AddArticleInputType } from "../dto/article.input-type";
// interfaces
import { userTokenData } from "src/interface/user.interface";

@Resolver()
export class ArticleResolver {
    constructor(
        private readonly articleService: ArticleService
    ) {}

    @UseGuards(AuthGuard)
    @Mutation(returns => SimpleResponse)
    async addArticle(
        @Args("article") article: AddArticleInputType,
        @Context("user") user: userTokenData
    ) {
        // get user id
        const { id } = user;
        // add article
        return this.articleService.addArticle(article, id);
    };

    @UseGuards(AuthGuard)
    @Mutation(returns => SimpleResponse)
    async likeArticle(
        @Args("articleId", { type: () => Int }) articleId: number,
        @Context("user") { id: userId }: userTokenData
    ) {
        return await this.articleService.likeArticle(articleId, userId);
    }
}