import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../category/category';
import { Product } from '../product/product';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  category: Category = {} as Category;
  products: Product[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts("", "", 0, 9999).subscribe(
      (data: { products: Product[]; pagination: any }) => {
        this.products = data.products;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  onSubmit(categoryForm: NgForm): void {
    this.categoryService.getAllCategories().subscribe(
      (data: { categories: Category[]; pagination: any }) => {
        const existingCategory = data.categories.find(category => category.name === this.category.name);
        if (existingCategory) {
          this.openSnackBar('Le nom de la catégorie existe déjà. Veuillez en choisir un autre.', 'Fermer');
          return;
        }

        this.categoryService.createCategory(this.category).subscribe(
          () => {
            this.openSnackBar('Catégorie créée avec succès', 'Fermer');
            this.router.navigate(['/categories']);
          },
          (error: any) => {
            console.error('Erreur lors de la création de la catégorie :', error);
          }
        );
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    );
  }

  goBack(form: NgForm): void {
    form.resetForm();
    this.router.navigate(['/categories']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
