import { IUser, UsersService } from '@app/models';
import { TokensService } from '@app/models';
import { Body, Controller, Headers, HttpException, Ip, Post } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { CredentialsDto } from './dto/credential.dto';

@Controller()
export class AuthController {
    constructor(
        private readonly _users: UsersService,
        private readonly _tokens: TokensService,
    ){}

    @Post('sign-in')
    async signIn(@Body() body: CredentialsDto, @Headers() headers: any, @Ip() ip: string){
        let user: IUser | undefined= await this._users.get(body.username);
        if (!user) throw new HttpException('Usuario incorrecto', 400);
        if (!compareSync(body.password, user.password)) throw new HttpException('Contraseña incorrecta', 400);
        let token = await this._tokens.generate({ user_id: user.id, type: 'web', hostname: body.hostname, ip });
        return {
            name: `${user.name} ${user.last_name}`,
            role: user.role,
            token: token.id
        }
    }
}
