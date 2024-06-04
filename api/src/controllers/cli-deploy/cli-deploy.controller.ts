import { AuthGuard, GetSession, Session } from '@app/auth';
import { DeployService } from '@app/common/deploy';
import { ApplicationsService, IApplication } from '@app/models';
import { Body, Controller, FileTypeValidator, HttpException, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('cli/deploy')
export class CliDeployController {
    constructor(
        private readonly _apps: ApplicationsService,
        private readonly _deploy: DeployService
    ){}

    @Post()
    @UseInterceptors(FileInterceptor('zip'))
    async deploy(@GetSession() session: Session, @Body('id') id: string, @UploadedFile(new ParseFilePipe({ validators: [  new FileTypeValidator({ fileType: 'zip' }) ]})) file: Express.Multer.File){
        let app: IApplication | undefined = await this._apps.get(id);
        if (!app) throw new HttpException('ID App no encontrada', 400);
        let permissions: string[] = await this._apps.getPermission(id, session.id);
        if (session.role == 'admin' || permissions.some(x => x == 'APP_DEPLOY')) {
            return this._deploy.run(app, file.buffer);
        }
        throw new HttpException('No tienes permisos para realizar esta acción', 403);
    }
}
