import { IsIn, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class AppAssignUserDto {
    @IsUUID()
    user_id!: UUID;

    @IsIn(['APP_UPDATE', 'APP_READ', 'APP_DELETE', 'APP_DEPLOY'], { each: true})
    permissions!: string[];
}