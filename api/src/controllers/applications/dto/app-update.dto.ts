import { PartialType } from "@nestjs/mapped-types";
import { AppCreateDto } from "./app-create.dto";

export class AppUpdateDto extends PartialType(AppCreateDto) {}