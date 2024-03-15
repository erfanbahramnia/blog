import { Field, Int, ObjectType } from "@nestjs/graphql"
import { ArticlesData } from "src/user/dtos/user.dto"
import { UserInfoInputType } from "src/user/interface/user.object-type"

@ObjectType()
export class GetArticles extends ArticlesData {
    @Field(() => UserInfoInputType)
    user: UserInfoInputType
}