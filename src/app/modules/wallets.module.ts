import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NewWalletDialogComponent } from '@components/new-wallet-dialog/new-wallet-dialog.component';
import { WalletPickerComponent } from '@components/wallet-picker/wallet-picker.component';
import { WalletComponent } from '@components/wallet/wallet.component';
import { MatModule } from '@modules/mat.module';
import { SharedModule } from '@modules/shared.module';
import { WalletsComponent } from '@pages/wallets/wallets.component';

@NgModule({
	declarations: [
		WalletsComponent,
		NewWalletDialogComponent,
		WalletComponent,
		WalletPickerComponent,
	],
	exports: [
		WalletsComponent,
		NewWalletDialogComponent,
		WalletComponent,
		WalletPickerComponent,
	],
	imports: [CommonModule, SharedModule, MatModule],
})
export class WalletsModule {}
