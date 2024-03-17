// nestjs
import { Inject, UseGuards } from "@nestjs/common";
// services
import { ArticleService } from "../service/article.service";
// guards
import { AuthGuard } from "src/guards/auth.guard";
// graphql
import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
// garphql object type
import { ArticleObjectType, SimpleResponse } from "../dto/article.object-type";
// garphql input types
import { AddArticleInputType } from "../dto/article.input-type";
// interfaces
import { userTokenData } from "src/interface/user.interface";
// cache
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Resolver()
export class ArticleResolver {
    constructor(
        private readonly articleService: ArticleService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
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

    @UseGuards(AuthGuard)
    @Mutation(returns => SimpleResponse)
    async dislikeArticle(
        @Args("articleId", { type: () => Int }) articleId: number,
        @Context("user") { id: userId }: userTokenData
    ) {
        return await this.articleService.dislikeArticle(articleId, userId);
    }

    // get accepted articles to users
    @Query(returns => [ArticleObjectType])
    async getArticles() {
        // check cache exist
        const cached = await this.cacheManager.get("articles");
        if(cached) 
            // send via cache
            return cached;
        // get articles
        return await this.articleService.getArticles()
    }
}