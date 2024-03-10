// graphql
import { Field, Int, ObjectType } from "@nestjs/graphql";
// typeorm
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// interface
import { IUserRepo } from "../interface/user.interface";

@ObjectType()
@Entity()
export class UserEntity extends IUserRepo{
    @Field()
    @Column("varchar")    
    first_name: string;

    @Field()
    @Column("varchar")    
    last_name: string;

    @Field()
    @Column("varchar")    
    username: string;

    @Field()
    @Column("varchar")    
    password: string;

    @Field()
    @Column("varchar")    
    salt: string;

    @Field()
    @Column("varchar", { unique: true })    
    email: string;

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
}