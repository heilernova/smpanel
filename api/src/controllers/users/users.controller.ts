import { AuthGuard, GetSession, Permission, RequirePermissions, Session } from '@app/auth';
import { UsersService } from '@app/models';
import { Body, Controller, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly _users: UsersService
    ){}

    @Get()
    @RequirePermissions(Permission.USERS_READ)
    async getAll(@GetSession() session: Session){
        (await this._users.getAll({ ignoreId: session.id })).map(x => {
            return {
                id: x.id,
                create_at: x.create_at,
                status: x.status,
                username: x.username,
                role: x.role,
                name: x.name,
                last_name: x.last_name,
                email: x.email,
                cellphone: x.cellphone,
                permission: x.permissions
            }
        });
    }

    @Post()
    @RequirePermissions(Permission.USERS_CREATE)
    async create(@Body() body: UserCreateDto){
        let { email, username } = await this._users.emailAndUsernameValid(body.email, body.username);
        if (!email || !username){
            let sms: string
            if (email == username) sms = 'El correo electrónico y el nombre de usuario ya están en uso.';
            else if (email) sms = 'El correo electrónico ya esta en uso.';
            else sms = 'El nombre de usuario ya esta en uso.';
            throw new HttpException(sms, 400);
        }

        let user = await this._users.create({...body, password: body.username });

        return {
            id: user.id,
            create_at: user.create_at,
            status: user.status,
            username: user.username,
            role: user.role,
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            cellphone: user.cellphone,
            permission: user.permissions
        }
    }

    @Put(':id')
    @RequirePermissions(Permission.USERS_UPDATE)
    async update(@Param('id') id: string, @Body() body: UserCreateDto){
        let user = await this._users.get(id);
        if (!user) throw new HttpException('Usuario no encontrado', 404);
        return this._users.update(id, body)
    }

    @Put(':id/reset-password')
    @RequirePermissions(Permission.USERS_UPDATE)
    async resetPassword(@Param('id') id: string){
        let user = await this._users.get(id);
        if (!user) throw new HttpException('Usuario no encontrado', 404);
        let pw: string = crypto.randomUUID().split('.').pop() as string;
        this._users.update(id, { password: pw });
        return pw;
    }
}
