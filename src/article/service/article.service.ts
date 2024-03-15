// nestjs
import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
// typeorm
import { InjectRepository } from "@nestjs/typeorm";
// entities
import { ArticleEntity } from "../entity/article.entity";
import { AddArticleInputType } from "../dto/article.input-type";
import { UserService } from "src/user/service/user.service";
import { Repository } from "typeorm";

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
    }
}