import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, MaxLength } from "class-validator";
import { IuserData } from "src/user/interface/user.interface";

@InputType()
export class UserRegister extends IuserData {
    @Field()
    @MaxLength(25)
    first_name: string;

    @Field()
    @MaxLength(35)
    last_name: string;

    @Field()
    @MaxLength(25)
    username: string;

    @Field()
    @MaxLength(30)
    password: string;

    @Field()
    @IsEmail()
    email: string;
}