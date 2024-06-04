import { Body, Controller, Get, HttpException, Patch, Put, UseGuards } from '@nestjs/common';
import { AuthGuard, GetSession, Session } from '@app/auth';
import { IUser, UsersService } from '@app/models';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly _users: UsersService,
    ){}

    @Get()
    async getInfo(@GetSession() session: Session){
        let user: IUser | undefined = await this._users.get(session.id);
        if (!user) throw new HttpException('Erro al cargar la información', 404);
        return {
            name: user.name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            cellphone: user.cellphone
        }
    }

    @Put()
    async update(@GetSession() session: Session, @Body() body: ProfileUpdateDto){
        let { email, username } = await this._users.emailAndUsernameValid(body.email, body.username, session.id);

        if (!email || !username){
            let sms: string
            if (email == username) sms = 'El correo electrónico y el nombre de usuario ya están en uso.';
            else if (email) sms = 'El correo electrónico ya esta en uso.';
            else sms = 'El nombre de usuario ya esta en uso.';
            throw new HttpException(sms, 400);
        }

        return this._users.update(session.id, body);
    }

    @Put('password')
    async updatePassword(@GetSession() session: Session, @Body() body: PasswordUpdateDto){
        if (!session.checkPassword(body.password)){
            throw new HttpException('Tú contraseña es incorrecta', 400);
        }
        return this._users.update(session.id, { password: body.new_password });
    }
}
