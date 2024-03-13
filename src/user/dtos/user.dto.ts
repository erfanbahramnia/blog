import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeleteUserType {
    @Field(() => Int)
    status: number;

    @Field()
    message: string;
};