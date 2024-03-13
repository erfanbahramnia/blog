import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Not, Repository } from "typeorm";
import { IuserData } from "../interface/user.interface";
import { compareHashPass, generateHashPass, generateSalt } from "src/utils/bcrypt";
import { UserFormalData } from "src/interface/user.interface";

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
            throw new BadRequestException(`${checkExist.email === email ? "email" : "username"} has been used!`);
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

            user: {
                username: result.username,
                email: result.email,
                id: result.id
            }
        };
    };

    async findUserByPassAndUsername(username: string, password: string) {
        // find by username
        const user = await this.userRepo.findOneBy({ username });
        // check user exist
        if(!user)
            throw new NotFoundException("User not found!");
        // check pasword is correct
        const convertedToHash = await generateHashPass(password, user.salt);
        const isValid = compareHashPass(user.password, convertedToHash)
        if(!isValid) 
            throw new BadRequestException("Password is not valid!");
        // success
        return {
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }
    };

    async getUsers(): Promise<UserFormalData[]> {
        return await this.userRepo.find({
            select: {
                email: true,
                first_name: true,
                last_name: true,
                username: true
            }
        })
    };
}