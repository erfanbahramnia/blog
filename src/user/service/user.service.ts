import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Not, Repository } from "typeorm";
import { IuserData } from "../interface/user.interface";
import { compareHashPass, generateHashPass, generateSalt } from "src/utils/bcrypt";
import { UserFormalData } from "src/interface/user.interface";
import { UpdateUserInfo } from "../dtos/updateUserInfo.dto";
import { PasswordsDto } from "../dtos/changePassword.dto";

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

    async updateUserInfo(newInfo: UpdateUserInfo, userId: number) {
        // check
        // check object is not empty
        if(!newInfo) 
            throw new BadRequestException("Please send data to update!");
        // check username is exist befor or not if user want to change it
        if(newInfo.username) {
            // find user
            const checkUsernameExist = await this.userRepo.findOne({
                where: {
                    username: newInfo.username,
                    id: Not(userId)
                }
            })
            if(checkUsernameExist)
                throw new BadRequestException("username have been used already")
        };
        // update data
        const updateResult = await this.userRepo.createQueryBuilder()
            .update(UserEntity)
            .set({
                ...newInfo
            })
            .where("id = :id", { id: userId })
            .execute()
        // check update
        if(!updateResult.affected)
            throw new InternalServerErrorException("couldn't update any data")
        // successs
        return {
            status: HttpStatus.OK,
            message: "user updated successfuly"
        }
    };

    async changePassword(passwords: PasswordsDto, userId) {
        // find user
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })
        // check user exist
        if(!user)
            throw new UnauthorizedException("please login to your account")
        // check pass
        const convertOldPassToHash = await generateHashPass(passwords.oldPassword, user.salt);
        const isValid = compareHashPass(convertOldPassToHash, user.password)
        if(!isValid)
            throw new BadRequestException("password is not valid");
        // update pass
        const newHashPass = await generateHashPass(passwords.newPassword, user.salt);
        user.password = newHashPass;
        // save changes
        const result = await this.userRepo.save(user);
        // check password changed
        const isChanged = compareHashPass(newHashPass, result.password);
        if(!isChanged)
            throw new InternalServerErrorException("could not change password");
        // success
        return {
            status: HttpStatus.OK,
            message: "Password updated successfuly"
        }
    };

    async deleteAccount(id: number) {
        // delete account
        const result = await this.userRepo.delete({
            id
        });
        // check account deleted or not
        if(!result.affected)
            throw new InternalServerErrorException("could not delete user!");
        // success
        return {
            status: HttpStatus.OK,
            message: "account deleted succesfuly"
        };
    };

    async findUserById(id: number) {
        return await this.userRepo.findOneBy({id});
    }
}