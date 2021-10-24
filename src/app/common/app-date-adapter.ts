import { NativeDateAdapter } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
	getFirstDayOfWeek() {
		return 1;
	}
}
