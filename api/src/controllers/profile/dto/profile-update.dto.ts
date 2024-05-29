import { IsEmail, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class ProfileUpdateDto {
    @IsString()
    @MaxLength(40)
    name!: string;

    @IsString()
    @MaxLength(40)
    last_name!: string;

    @IsString()
    @MaxLength(30)
    username!: string;

    @IsEmail()
    @MaxLength(100)
    email!: string;

    @IsPhoneNumber()
    cellphone!: string | null;
}