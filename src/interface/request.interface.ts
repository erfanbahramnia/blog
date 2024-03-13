import { Request } from "express";
import { userTokenData } from "./user.interface";

export interface IRequestData extends Request {
    user: userTokenData;
}