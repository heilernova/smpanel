import { IsString, MaxLength } from "class-validator";

export class PasswordUpdateDto {
    @IsString()
    @MaxLength(50)
    password!: string;
    
    @IsString()
    @MaxLength(50)
    new_password!: string;
}