import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChangeRoleResponse {
    @Field(() => Int)
    status: number

    @Field()
    message: string
}