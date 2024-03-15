// graphql
import { Field, Int, ObjectType } from "@nestjs/graphql";
// enums
import { ArticleStatusEnum } from "src/constants/constants";
// entities
import { UserEntity } from "src/user/entity/user.entity";
// typeorm
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class ArticleEntity {
    @Field()
    @Column("varchar")
    title: string

    @Field()
    @Column("varchar")
    description: string

    @Field()
    @Column("varchar")
    text: string

    @Field()
    @Column("varchar")
    summary: string

    @Field()
    @Column("varchar", { default: ArticleStatusEnum.Pending})
    status: string;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (userEntity) => userEntity.id, {
        cascade: true
    })
    user: UserEntity

    @Field(() => Date)
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => [UserEntity])
    @ManyToMany(() => UserEntity, (userEntity) => userEntity.id, {
        cascade: true
    })
    @JoinTable()
    like: UserEntity[];

    @Field(() => [UserEntity])
    @ManyToMany(() => UserEntity, (userEntity) => userEntity.id, {
        cascade: true
    })
    @JoinTable()
    dislike: UserEntity[];
}