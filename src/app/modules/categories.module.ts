import { NgModule } from '@angular/core';
import { CategoriesListComponent } from '@components/categories-list/categories-list.component';
import { CategoryComponent } from '@components/category/category.component';
import { NewCategoryDialogComponent } from '@components/new-category-dialog/new-category-dialog.component';
import { SharedModule } from '@modules/shared.module';
import { CategoriesComponent } from '@pages/categories/categories.component';

@NgModule({
	declarations: [
		CategoriesComponent,
		CategoriesListComponent,
		CategoryComponent,
		NewCategoryDialogComponent,
	],
	exports: [
		CategoriesComponent,
		CategoriesListComponent,
		CategoryComponent,
		NewCategoryDialogComponent,
	],
	imports: [SharedModule],
})
export class CategoriesModule {}
