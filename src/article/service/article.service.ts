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

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepo: Repository<ArticleEntity>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) {};

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
            .addSelect(["UserEntity.username", "UserEntity.first_name", "UserEntity.last_name", "UserEntity.email"])
            .andWhere("ArticleEntity.status = :status", { status })
            .orderBy("ArticleEntity.createdAt", "ASC")
            .getMany();
    };

    async getUserArticlesByStatus(status: string, id: number) {
        // get articles with there writers
        return await this.articleRepo.createQueryBuilder("ArticleEntity")
            .leftJoin("ArticleEntity.user", "UserEntity")
            .andWhere("ArticleEntity.status = :status", { status })
            .andWhere("UserEntity.id = :id", { id })
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
            throw new InternalServerErrorException("Couldn't update article")
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
    }
}