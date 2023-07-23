import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shop } from '../shop/shop';
import { ShopService } from '../shop/shop.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.css']
})
export class EditShopComponent implements OnInit {
  shop: Shop = {} as Shop;
  originalOpeningHours: string = '';

  constructor(
    private shopService: ShopService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const shopIdParam = this.route.snapshot.paramMap.get('id');
    const shopId = shopIdParam ? parseInt(shopIdParam, 10) : null;
    
    if (shopId !== null) {
      this.shopService.getShopById(shopId).subscribe(
        (shop: Shop) => {
          this.shop = shop; 
          this.originalOpeningHours = shop.openingHours;
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des détails de la boutique :', error);
        }
      );
    } else {
      console.error('Erreur lors de la récupération de l\'id de la boutique');
    }
  }

  onSubmit(): void {
    const openingTime = this.parseTime(this.shop.openingHours);
    const closingTime = this.parseTime(this.shop.closingHours);

    if (openingTime > closingTime) {
      this.openSnackBar('L\'horaire d\'ouverture doit être inférieur à l\'horaire de fermeture', 'Fermer');
      return;
    }

    this.shopService.getAllShops().subscribe(
      (shops: Shop[]) => {
        const existingShop = shops.find(shop => shop.name === this.shop.name);
        if (existingShop) {
          this.openSnackBar('Le nom de la boutique existe déjà. Veuillez en choisir un autre.', 'Fermer');
          return;
        }

        this.shopService.updateShop(this.shop).subscribe(
          () => {
            this.openSnackBar('Boutique modifiée avec succès', 'Fermer');
            this.router.navigate(['/shops']);
          },
          (error: any) => {
            console.error('Erreur lors de la modification de la boutique :', error);
          }
        );
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des boutiques :', error);
      }
    );
  }

  goBack(form: NgForm): void {
    form.resetForm();
    this.router.navigate(['/shops']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'bottom',
    });
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}