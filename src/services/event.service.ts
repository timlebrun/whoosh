import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class WhooshEventService extends EventEmitter2 {
	constructor() {
		super();
	}
}
