import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WhooshPointService } from 'src/services/point.service';
import * as uuid from 'uuid';

@WebSocketGateway({ path: '/api/events' })
export class WhooshEventGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(this.constructor.name);

	private readonly clients: Record<string, IWhooshGatewayWebSocket> = {};

	constructor(private readonly service: WhooshPointService) {
		this.service.on('point', (data: any) => {
			console.log('POINT', { data });
			this.broadcast('point', data);
		});
	}

	public broadcast(event: string, data: any) {
		const broadcastPayload = this.makeMessagePayload(event, data);

		for (const client of Object.values(this.clients)) client.send(broadcastPayload);
	}

	private makeMessagePayload(event: string, data: any = undefined): string {
		const payload = {
			event,
			clock: Date.now(),
			data,
		};

		return JSON.stringify(payload);
	}

	@SubscribeMessage('point')
	async handleTrackPauseEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IWhooshGatewayWebSocket,
	) {
		const currentTimestamp = Date.now();
		this.service.push({ ...data, c: client._id, d: currentTimestamp });
	}

	@SubscribeMessage('log')
	async handleLogEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IWhooshGatewayWebSocket,
	) {
		this.logger.debug(`=> ${data}`);
	}

	handleConnection(client: IWhooshGatewayWebSocket, request: IncomingMessage) {
		client._id = uuid.v1(); // Generates a unique client ID on connection for tracking
		this.clients[client._id] = client;
		this.logger.verbose(`Client ${client._id} connected !`);
	}

	handleDisconnect(client: any) {
		delete this.clients[client._id];
		this.logger.verbose(`Client ${client._id} disconnected...`);
	}
}

type IWhooshGatewayWebSocket = WebSocket & { _id: string };
