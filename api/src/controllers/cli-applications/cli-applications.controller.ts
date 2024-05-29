import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, GetSession, Session } from '@app/auth';
import { ApplicationsService, IApplication } from '@app/models';

@UseGuards(AuthGuard)
@Controller('cli/applications')
export class CliApplicationsController {
    constructor(private readonly _apps: ApplicationsService){}

    @Get()
    async get(@GetSession() session: Session){
        let list: IApplication[];
        if (session.role == 'admin') {
            list = await this._apps.getAll();
        } else {
            list = await this._apps.getAllForUser(session.id);
        }

        return list.map(x => {
            return {
                id: x.id,
                domain: x.domain,
                name: x.name,
                framework: x.framework,
                running_on: x.running_on,
                runtime_environment: x.runtime_environment
            }
        })
    }
}
