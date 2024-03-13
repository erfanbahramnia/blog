import { Field, InputType, Int, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { UserRegister } from "src/auth/dtos/auth.input";

@ObjectType()
export class UpdateUserDataType {
    @Field()
    @IsString()
    message: string

    @Field((type) => Int)
    @IsNumber()
    status: number
}

@InputType()
export class UpdateUserInfo extends PartialType(OmitType(UserRegister, ['password', 'email'] as const)) {}