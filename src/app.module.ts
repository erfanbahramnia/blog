// nestjs conf
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
// config modules
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// app modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ArticleModule } from './article/article.module';
import { DeveloperModule } from './developer/developer.module';
// utils
import { join } from 'path';
// entities
import { UserEntity } from './user/entity/user.entity';
import { ArticleEntity } from './article/entity/article.entity';

@Module({
  imports: [
    // app modules
    AuthModule,
    UserModule,
    ArticleModule,
    AdminModule,
    DeveloperModule,
    // conf modules
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "erfan.81",
      database: "blog",
      entities: [
        UserEntity,
        ArticleEntity
      ],
      synchronize: true,
      autoLoadEntities: true
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true
    })
  ]
})
export class AppModule {}
