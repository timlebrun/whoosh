import { Module } from '@nestjs/common';

import { WhooshRootController } from './controllers/root.controller';
import { WhooshEventGateway } from './gateways/event.gateway';
import { WhooshEventService } from './services/event.service';
import { WhooshPointService } from './services/point.service';

@Module({
	imports: [],
	controllers: [WhooshRootController],
	providers: [WhooshEventService, WhooshPointService, WhooshEventGateway],
})
export class Whoosh {}
