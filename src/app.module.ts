// nestjs conf
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
// config modules
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
// app modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // app modules
    AuthModule,
    UserModule,
    // conf modules
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "erfan.81",
      database: "blog",
      entities: [
        UserEntity
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
