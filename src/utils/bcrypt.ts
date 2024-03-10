import * as bcrypt from "bcrypt"

export async function generateSalt(): Promise<string> {
    return await bcrypt.genSalt(10);
};

export async function generateHashPass(pass: string, salt: string): Promise<string> {
    return await bcrypt.hash(pass, salt)
};

export function compareHashPass(first_pass: string, second_pass: string) {
    return first_pass === second_pass ? true : false;
};