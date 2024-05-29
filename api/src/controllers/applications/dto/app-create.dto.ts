import { 
    APP_FRAMEWORK_LIST,
    APP_RUNNING_ON,
    APP_RUNTIME_ENVIRONMENT,
    AppFramework,
    AppRunningOn,
    AppRuntimeEnvironment,
    IApplicationCreate
} from "@app/models";
import { IsIn, IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class AppCreateDto implements IApplicationCreate {
    @IsString()
    @MaxLength(100)
    domain!: string;

    @IsString()
    @MaxLength(50)
    name!: string;

    @IsString()
    @MaxLength(600)
    location!: string;

    @IsString()
    @MaxLength(50)
    @IsOptional()
    startup_file?: string | undefined;

    @IsIn(APP_FRAMEWORK_LIST)
    @IsOptional()
    framework?: AppFramework | null | undefined;

    @IsIn(APP_RUNNING_ON)
    @IsOptional()
    running_on?: AppRunningOn | null | undefined;

    @IsIn(APP_RUNTIME_ENVIRONMENT)
    @IsOptional()
    runtime_environment?: AppRuntimeEnvironment | null | undefined;

    @IsString()
    @IsOptional()
    url?: string | null | undefined;

    @IsObject()
    @IsOptional()
    github?: any;
    
    @IsObject()
    @IsOptional()
    env?: { [key: string]: string; } | undefined;
    
    @IsString({ each: true })
    @IsOptional()
    ignore?: string[] | undefined;
    
    @IsString()
    @MaxLength(1000)
    @IsOptional()
    observation?: string | undefined;
}