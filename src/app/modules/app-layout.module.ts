import { NgModule } from '@angular/core';
import { MainNavbarComponent } from '@components/main-navbar/main-navbar.component';
import { MainSidenavComponent } from '@components/main-sidenav/main-sidenav.component';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { SharedModule } from '@modules/shared.module';

@NgModule({
	declarations: [MainNavbarComponent, SidenavComponent, MainSidenavComponent],
	exports: [MainNavbarComponent, SidenavComponent, MainSidenavComponent],
	imports: [SharedModule],
})
export class AppLayoutModule {}
