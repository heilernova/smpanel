import { AuthGuard, GetSession, Session } from '@app/auth';
import { IUserTokenDbRow, TokensService } from '@app/models';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('profile/tokens')
export class ProfileTokensController {
    constructor(
        private readonly _tokens: TokensService
    ){}

    @Get()
    async getAll(@GetSession() session: Session){
        let tokens: IUserTokenDbRow[] = await this._tokens.getAll({ userId: session.id });
        return tokens.map(x => {
            return {
                id: x.id,
                create_at: x.create_at,
                type: x.type,
                ip: x.id,
                hostname: x.hostname,
                device: x.device,
                platform: x.platform,
                exp: x.exp
            }
        })
    }

    @Delete()
    async deleteAll(@GetSession() session: Session){
        return this._tokens.deleteAll(session.id, session.token);
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return this._tokens.delete(id);
    }
}
