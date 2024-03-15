import { Field, Int, ObjectType } from "@nestjs/graphql"
import { UserInfoInputType } from "src/user/interface/user.object-type"

@ObjectType()
export class GetPendingArticles {
    @Field()
    title: string

    @Field()
    description: string

    @Field()
    text: string

    @Field()
    summary: string

    @Field(() => Int)
    id: number

    @Field(() => UserInfoInputType)
    user: UserInfoInputType
}