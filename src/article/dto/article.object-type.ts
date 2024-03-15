import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SimpleResponse {
    @Field(() => Int)
    status: number;

    @Field()
    message: string;
}