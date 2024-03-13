import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserDataDto {
    @Field()
    email: string;
    @Field()
    first_name: string;
    @Field()
    last_name: string;
    @Field()
    username: string;
}