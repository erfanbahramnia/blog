export class IuserData {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
}

export class UserInfo {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}

export class IUserRepo extends IuserData {
    salt: string;
    role: string
    id: number
}