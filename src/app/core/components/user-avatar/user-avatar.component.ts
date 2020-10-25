import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/core/services/auth.service';

/**
 * A user avatar component
 * @class {UserAvatarComponent}
 */
@Component({
	selector: 'app-user-avatar',
	templateUrl: './user-avatar.component.html',
	styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit, OnDestroy {
	user: any;
	subscriptions: Subscription = new Subscription();
	initials: string;

	constructor(
		private _auth: AuthService
	) {
	}

	ngOnInit(): void {
		 
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

}
