import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ArticlesData } from "src/user/dtos/user.dto";
import { UserInfoInputType } from "src/user/dtos/user.object-type";

@ObjectType()
export class SimpleResponse {
    @Field(() => Int)
    status: number;

    @Field()
    message: string;
}

@ObjectType()
export class ArticleObjectType extends ArticlesData {
    @Field(() => UserInfoInputType)
    user: UserInfoInputType;
};