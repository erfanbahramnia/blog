import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { IuserData } from "../interface/user.interface";
import { generateHashPass, generateSalt } from "src/utils/bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    ) {};

    async createNewUser(userData: IuserData) {
        // check email or username exists or not
        const {email, username} = userData;
        const checkExist = await this.userRepo.findOne({
            where: [
                { email },
                { username }
            ]
        });
        if(checkExist)
            return new BadRequestException(`${checkExist.email === email ? "email" : "username"} has been used!`);
        // generate salt for hashing pass
        const salt = await generateSalt();
        // generate hash pass
        const hashPass = await generateHashPass(userData.password, salt)
        // create new user
        const user = this.userRepo.create({
            ...userData,
            salt,
            password: hashPass
        });
        // save user
        const result = await this.userRepo.save(user);
        // chekc user saved or not
        if(!result)
            throw new InternalServerErrorException("Internal Server Error")
        // success
        return {
            status: HttpStatus.CREATED,
            message: "user registered successfuly",
            user: {
                username: result.username,
                email: result.email,
            }
        };
    };


}