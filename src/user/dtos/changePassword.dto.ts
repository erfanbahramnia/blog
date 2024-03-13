import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { UpdateUserDataType } from "./updateUserInfo.dto";

@InputType()
export class PasswordsDto {
    @Field()
    @IsString()
    oldPassword: string

    @Field()
    @IsString()
    newPassword: string
}

@ObjectType()
export class ChnageUserPasswrdRes extends UpdateUserDataType {}