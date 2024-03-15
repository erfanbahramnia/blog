// nestjs
import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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
        private readonly userService: UserService
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

    async getPendingArticlesByStatus(status: string) {
        // get articles with there writers
        return await this.articleRepo.createQueryBuilder("ArticleEntity")
            .leftJoin("ArticleEntity.user", "UserEntity")
            .addSelect(["UserEntity.username", "UserEntity.first_name", "UserEntity.last_name", "UserEntity.email"])
            .andWhere("ArticleEntity.status = :status", { status })
            .orderBy("ArticleEntity.createdAt", "ASC")
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
    }
}