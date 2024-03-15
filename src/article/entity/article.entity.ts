import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ArticleStatusEnum } from "src/constants/constants";
import { UserEntity } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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