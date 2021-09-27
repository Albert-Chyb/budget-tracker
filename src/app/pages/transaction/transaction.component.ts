import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/common/interfaces/category';
import { IWallet } from 'src/app/common/interfaces/wallet';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

interface ITransactionFormValue {
	amount: string;
	type: 'expense' | 'income';
	date: Date;
	category: string;
	wallet: string;
	description: string;
}

@Component({
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent implements OnInit {
	constructor(
		private readonly _route: ActivatedRoute,
		private readonly _categories: CategoriesService,
		private readonly _wallets: WalletsService,
		private readonly _loading: LoadingService
	) {}

	@ViewChild('transactionForm') transactionForm: NgForm;

	selectedWallet: IWallet;

	isInEditState = !!this._route.snapshot.paramMap.get('id');
	formValue: ITransactionFormValue = {
		amount: null,
		type: 'expense',
		date: new Date(),
		category: null,
		wallet: null,
		description: null,
	};
	data$: Observable<{
		categories: ICategory[];
		wallets: IWallet[];
	}>;

	ngOnInit() {
		this.data$ = this._loading.add(
			combineLatest([this._categories.readAll(), this._wallets.getAll()]).pipe(
				map(([categories, wallets]) => ({ categories, wallets }))
			)
		);
	}

	create() {
		console.log('Creating a transaction');
	}

	update() {
		console.log('Updating the transaction');
	}

	delete() {
		console.log('Deleting the transaction');
	}

	setWallet(wallet: IWallet) {
		this.formValue.wallet = wallet?.id ?? null;
		this.selectedWallet = wallet;
	}

	findWallet(wallets: IWallet[], id: string) {
		return wallets.find(wallet => wallet.id === id);
	}

	get maxAmount(): number | null {
		return this.formValue.type === 'expense'
			? this.selectedWallet?.balance
			: null;
	}
}
