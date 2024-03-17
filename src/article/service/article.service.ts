// nestjs
import { BadRequestException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from "@nestjs/common";
// typeorm
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// entities
import { ArticleEntity } from "../entity/article.entity";
// graphql
import { AddArticleInputType } from "../dto/article.input-type";
// services
import { UserService } from "src/user/service/user.service";
// enums
import { ArticleStatusEnum } from "src/constants/constants";
// cache
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepo: Repository<ArticleEntity>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache 
    ) {};

    async getArticles() {
        const articles = await this.articleRepo.createQueryBuilder()
            .leftJoin("ArticleEntity.user", "writer")
            .leftJoin("ArticleEntity.like", "likedUsers")
            .leftJoin("ArticleEntity.dislike", "dislikedUsers")
            .andWhere("ArticleEntity.status = :status", { status: ArticleStatusEnum.Accepted })
            .addSelect(["writer.username", "writer.first_name", "writer.last_name", "writer.email"])
            .addSelect(["likedUsers.username", "likedUsers.first_name", "likedUsers.last_name", "likedUsers.email"])
            .addSelect(["dislikedUsers.username", "dislikedUsers.first_name", "dislikedUsers.last_name", "dislikedUsers.email"])
            .getMany();
        // save in cache
        const a = await this.cacheManager.set("articles", articles, 60*1000);
        // success
        return articles;
    }

    async addArticle(data: AddArticleInputType, userId: number) {
        // find user
        const user = await this.userService.findUserById(userId);
        // check user exist
        if(!user)
            throw new NotFoundException("User not found!");
        // create new article
        const article = await this.articleRepo.create({
            description: data.description,
            text: data.text,
            title: data.title,
            summary: data.summary
        });
        // make relation with creator
        article.user = user;
        // save changes
        const result = await this.articleRepo.save(article);
        // check article saved or not
        if(!result)
            throw new InternalServerErrorException("Could not add article");
        // success
        return {
            status: HttpStatus.CREATED,
            message: "article added successfuly"
        };
    };

    async getArticlesByStatus(status: string) {
        // get articles with there writers
        return await this.articleRepo.createQueryBuilder("ArticleEntity")
            .leftJoin("ArticleEntity.user", "UserEntity")
            .leftJoin("ArticleEntity.like", "Likes")
            .leftJoin("ArticleEntity.dislike", "DisLikes")
            .addSelect(["UserEntity.username", "UserEntity.first_name", "UserEntity.last_name", "UserEntity.email"])
            .addSelect(["Likes.username", "Likes.first_name", "Likes.last_name", "Likes.email"])
            .addSelect(["DisLikes.username", "DisLikes.first_name", "DisLikes.last_name", "DisLikes.email"])
            .andWhere("ArticleEntity.status = :status", { status })
            .orderBy("ArticleEntity.createdAt", "ASC")
            .getMany();
    };

    async getUserArticlesByStatus(status: string, id: number) {
        // get articles with there writers
        return await this.articleRepo.createQueryBuilder("ArticleEntity")
            .leftJoin("ArticleEntity.user", "User")
            .leftJoin("ArticleEntity.like", "Likes")
            .leftJoin("ArticleEntity.dislike", "Dislikes")
            .andWhere("ArticleEntity.status = :status", { status })
            .andWhere("User.id = :id", { id })
            .addSelect(["Likes.first_name", "Likes.last_name", "Likes.username", "Likes.email",])
            .addSelect(["Dislikes.first_name", "Dislikes.last_name", "Dislikes.username", "Dislikes.email",])
            .orderBy("ArticleEntity.createdAt", "DESC")
            .getMany();
    };    

    async changeArticleStatus(status: string, id: number) {
        if(status === ArticleStatusEnum.Pending)
            throw new BadRequestException("request for change status to Pending status is not valid for article")
        // check product exist
        const article = await this.articleRepo.findOneBy({ id });
        if(!article) 
            throw new NotFoundException("Article not found!");
        // check status is valid
        if(status !== ArticleStatusEnum.Accepted && status !== ArticleStatusEnum.Rejected)
            throw new BadRequestException("Status is not valid");
        // update product
        article.status = status;
        const res = await this.articleRepo.save(article);
        // check update
        if(res.status !== status)
            throw new InternalServerErrorException("Couldn't update article");
        // update cache
        await this.getArticles();
        // success
        return {
            status: HttpStatus.OK,
            message: "article's status updated"
        }
    };

    async deleteArticleById(id: number) {
        // chekc product exist
        const checkExist = await this.articleRepo.findOneBy({ id });
        if(!checkExist)
            throw new NotFoundException("Product Not Found!");
        // delete article
        const result = await this.articleRepo.delete({ id });
        // check deletion
        if(!result.affected)
            throw new InternalServerErrorException("Could not remove article")
        // sucess
        return {
            status: HttpStatus.OK,
            message: "Article removed sucessfuly"
        };
    };

    async getUserArticles(userId: number) {
        try {
            // get user's article with pending status
            const pendingArticles = await this.getUserArticlesByStatus(ArticleStatusEnum.Pending, userId);
            // get user's article with accepted status
            const acceptedArticles = await this.getUserArticlesByStatus(ArticleStatusEnum.Accepted, userId);
            // get user's article with rejected status
            const rejectedArticles = await this.getUserArticlesByStatus(ArticleStatusEnum.Rejected, userId);
            // success
            return {
                articles: {
                    pendingArticles,
                    acceptedArticles,
                    rejectedArticles
                }
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("InternalServerError");
        }
    };

    async deleteArticleByUser(articleId: number, userId: number) {
        // check article exist
        const article = await this.articleRepo
            .createQueryBuilder()
            .leftJoin("ArticleEntity.user", "UserEntity")
            .andWhere("UserEntity.id = :userId", { userId })
            .andWhere("ArticleEntity.id = :articleId", { articleId })
            .getOne();
        if(!article)
            throw new NotFoundException("Article does not exist");
        // delete article
        const result = await this.articleRepo.delete({ id: articleId });
        // chekc delete result
        if(!result.affected)
            throw new InternalServerErrorException("Could not delete article")
        // success
        return {
            status: HttpStatus.OK,
            message: "Article removed successfuly"
        };
    };

    async deleteArticleByAdmin(articleId: number) {
        // check article exist
        const article = await this.articleRepo.findOneBy({ id: articleId });
        if(!article)
            throw new NotFoundException("Article does not exist!");
        // delete article
        const result = await this.articleRepo.delete({ id: articleId });
        // check deletion result
        if(!result.affected)
            throw new InternalServerErrorException("Could not delete article!");
        // success
        return {
            status: HttpStatus.OK,
            message: "Article removed successfuly"
        };
    };

    async likeArticle(articleId: number, userId: number) {
        // find user
        const user = await this.userService.findUserById(userId);
        // check user exist
        if(!user) 
            throw new NotFoundException("User not found!");
        // find article
        const article = await this.articleRepo.findOne({
            where: {
                id: articleId
            },
            relations: {
                like: true,
                dislike: true
            }
        });
        // check article exist
        if(!article) 
        throw new NotFoundException("Article not found!");
        // check article status
        if(article.status !== ArticleStatusEnum.Accepted)
            throw new BadRequestException("Article not Found!");
        // check alread liked
        const articleLiked = article.like.map(item => item.id === user.id);
        if(articleLiked)
            throw new BadRequestException("User already liked the article");
        // remove user from dislike if exist
        article.dislike = article.dislike.filter(item => item.id !== user.id);
        // make relation with article and user
        article.like.push(user);
        // save changes
        const updatedArticle = await this.articleRepo.save((article));
        // check update
        const checkLike = updatedArticle.like.map(item => item.id === user.id);
        if(!checkLike)
            throw new InternalServerErrorException("Internal server error");        
        // success
        return {
            status: HttpStatus.OK,
            message: "article updated successfuly"
        };
    };

    async dislikeArticle(articleId: number, userId: number) {
        // find user
        const user = await this.userService.findUserById(userId);
        // check user exist
        if(!user) 
            throw new NotFoundException("User not found!");
        // find article
        const article = await this.articleRepo.findOne({
            where: {
                id: articleId
            },
            relations: {
                like: true,
                dislike: true
            }
        });
        // check article exist
        if(!article) 
        throw new NotFoundException("Article not found!");
        // check article status
        if(article.status !== ArticleStatusEnum.Accepted)
            throw new BadRequestException("Article not Found!");
        // check alread disliked
        const articleDisLiked = article.dislike.map(item => item.id === user.id);
        if(articleDisLiked)
            throw new BadRequestException("User already disliked the article");
        // remove user from like if exist
        article.like = article.like.filter(item => item.id !== user.id);
        // make relation with article and user
        article.dislike.push(user);
        // save changes
        const updatedArticle = await this.articleRepo.save((article));
        // check update
        const checkDisLike = updatedArticle.dislike.map(item => item.id === user.id);
        if(!checkDisLike)
            throw new InternalServerErrorException("Internal server error");        
        // success
        return {
            status: HttpStatus.OK,
            message: "article updated successfuly"
        };
    };
}