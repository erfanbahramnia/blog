import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddArticleInputType {
    @Field()
    title: string

    @Field()
    description: string

    @Field()
    text: string

    @Field()
    summary: string
}