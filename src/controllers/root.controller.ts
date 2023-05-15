import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class WhooshRootController {
	@Get()
	@Render('pages/home')
	index() {
		return {};
	}
}
