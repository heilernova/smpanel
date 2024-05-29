import { IsString, MaxLength } from "class-validator";

export class CredentialsDto {
    @IsString()
    @MaxLength(30)
    hostname!: string;

    @IsString()
    @MaxLength(100)
    username!: string;

    @IsString()
    @MaxLength(30)
    password !: string;
}