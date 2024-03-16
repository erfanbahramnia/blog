import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserInfoInputType } from "./user.object-type";

@ObjectType()
export class DeleteUserType {
    @Field(() => Int)
    status: number;

    @Field()
    message: string;
};

@ObjectType()
export class ArticlesData {
    @Field()
    title: string
    
    @Field()
    description: string
    
    @Field()
    text: string
    
    @Field()
    summary: string

    @Field(() => [UserInfoInputType])    
    like: UserInfoInputType[]

    @Field(() => [UserInfoInputType])    
    dislike: UserInfoInputType[]
    
    @Field(() => Int)
    id: number
}


@ObjectType()
export class UserArtilesSeperatedByStatus {
    @Field(() => [ArticlesData])
    pendingArticles: ArticlesData[]
    
    @Field(() => [ArticlesData])
    acceptedArticles: ArticlesData[]
    
    @Field(() => [ArticlesData])
    rejectedArticles: ArticlesData[]
    
}

@ObjectType()
export class UserArtiles {
    @Field(() => UserArtilesSeperatedByStatus)
    articles: UserArtilesSeperatedByStatus
}