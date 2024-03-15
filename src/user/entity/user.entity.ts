// graphql
import { Field, Int, ObjectType } from "@nestjs/graphql";
// typeorm
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// interface
import { IUserRepo } from "../interface/user.interface";
import { ArticleEntity } from "src/article/entity/article.entity";
import { RolesEnum } from "src/constants/constants";

@ObjectType()
@Entity()
export class UserEntity extends IUserRepo {
    @Field()
    @Column("varchar")    
    first_name: string;

    @Field()
    @Column("varchar")    
    last_name: string;

    @Field()
    @Column("varchar")    
    username: string;

    @Field()
    @Column("varchar")    
    password: string;

    @Field()
    @Column("varchar")    
    salt: string;

    @Field()
    @Column("varchar", { unique: true })    
    email: string;

    @Field()
    @Column("varchar", { default: RolesEnum.User })
    role: string

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => [ArticleEntity])
    @OneToMany(() => ArticleEntity, (articleEntity) => articleEntity.user)
    article: ArticleEntity[];

    @Field(() => [ArticleEntity])
    @ManyToMany(() => ArticleEntity, (articleEntity) => articleEntity.like)
    like: ArticleEntity[];

    @Field(() => [ArticleEntity])
    @ManyToMany(() => ArticleEntity, (articleEntity) => articleEntity.dislike)
    dislike: ArticleEntity[];
}