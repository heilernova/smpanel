import { GetSession, Permission, RequirePermissions, Session } from '@app/auth';
import { Pm2Service } from '@app/common/pm2';
import { ApplicationsService, IApplication } from '@app/models';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { AppCreateDto } from './dto/app-create.dto';
import { AppUpdateDto } from './dto/app-update.dto';

@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly _apps: ApplicationsService,
        private readonly _pm2: Pm2Service
    ){}

    @Post()
    @RequirePermissions(Permission.APP_CREATE)
    async create(@Body() body: AppCreateDto) {
        if (!(await this._apps.nameValid(body.name, body.domain))){
            throw new HttpException('El nombre ya esta en uso', 400);
        }
        return await this._apps.create(body);
    }

    @Get()
    async getAll(@GetSession() session: Session) {
        if (session.role == 'admin'){
            return this._apps.getAll();
        } else {
            return this._apps.getAllForUser(session.id);
        }
    }

    @Put(':id')
    @RequirePermissions(Permission.APP_UPDATE)
    async update(@Param('id') id: string, @GetSession() session: Session, @Body() body: AppUpdateDto){
        let app: IApplication | undefined = await this._apps.get(id);
        if (!app) throw new HttpException('App no encontrada', 404);
        let permissions = await this._apps.getPermission(app.id, session.id);
        if (session.role == 'admin' || permissions.some(x => x == 'APP_UPDATE')){
            return await this._apps.update(id, body);
        }
        throw new HttpException('No tienes permisos', 403);
    }

    @Delete(':id')
    @RequirePermissions(Permission.APP_DELETE)
    async delete(@Param('id') id: string, @GetSession() session: Session){
        let app: IApplication | undefined = await this._apps.get(id);
        if (!app) throw new HttpException('App no encontrada', 404);
        await this._apps.delete(app.id);
    }

    @Put(':id/reload')
    async reload(@Param('id') id: string, @GetSession() session: Session){
        let app: IApplication | undefined = await this._apps.get(id);
        if (!app) throw new HttpException('App no encontrada', 404);
        if (!app) throw new HttpException('App no encontrada', 404);

        if (app.framework == 'NestJS' && app.running_on == 'PM2'){
            return this._pm2.runApp(app);
        }
        
        if (app.framework == 'Angular' && app.running_on == 'PM2'){
            return this._pm2.runApp(app);
        }

        return "online";
    }
}
