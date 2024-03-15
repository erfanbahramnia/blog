import { Field, ObjectType } from "@nestjs/graphql";
import { UserInfo } from "./user.interface";

@ObjectType()
export class UserInfoInputType implements UserInfo {
    @Field()    
    first_name: string;
    @Field()
    last_name: string;
    @Field()
    username: string;
    @Field()
    email: string;
}