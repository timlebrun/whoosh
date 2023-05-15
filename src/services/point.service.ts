import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class WhooshPointService extends EventEmitter2 {
	public static pointTTL = 3000;

	constructor() {
		super();
	}

	private readonly points: IWhooshPointServicePoint[] = [];

	public push(point: IWhooshPointServicePoint) {
		const identifiedPoint = { ...point, i: this.points.length };
		this.points.push(identifiedPoint);
		this.emit('point', identifiedPoint);
	}

	public list() {
		return this.points;
	}

	public tick() {
		const currentTimestamp = Date.now();

		for (let i = 0; i < this.points.length; i++) {
			const point = this.points[i];

			if (point.d + WhooshPointService.pointTTL < currentTimestamp) this.points.splice(i);
		}
	}
}

export interface IWhooshPointServicePoint {
	i: number; // id
	x: number; // x position
	y: number; // y position
	p: number; // pressure
	t: IWhooshPointServicePointType;
	c: string; // client id
	d: number; // datetime as MS timestamp
}

export enum IWhooshPointServicePointType {
	mouse = 'M',
	touch = 'T',
	pen = 'P',
}
