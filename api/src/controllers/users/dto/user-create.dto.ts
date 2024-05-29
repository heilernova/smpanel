import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class UserCreateDto {
    @IsString()
    @MaxLength(20)
    username!: string;
    
    @MaxLength(30)
    name!: string;
    
    @MaxLength(30)
    last_name!: string;
    
    @IsEmail()
    @MaxLength(100)
    email!: string;
    
    @IsPhoneNumber()
    @IsOptional()
    cellphone?: string
}

