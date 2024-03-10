import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
class UserResponseData {
    @Field()
    username: string;

    @Field()
    email: string;
}

@ObjectType()
export class AuthRegisterResponse {
    @Field((type) => Int)
    status: number;

    @Field()
    message: string;

    @Field((type) => UserResponseData)
    user: UserResponseData;

    @Field()
    token: string
}