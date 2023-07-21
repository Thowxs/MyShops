import { Component, OnInit } from '@angular/core';
import { Shop } from '../shop/shop';
import { ShopService } from '../shop/shop.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  shops: Shop[] = [];
  dialogRef!: any;

  constructor(private shopService: ShopService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getShops();
  }

  getShops(): void {
    this.shopService.getAllShops()
      .subscribe(shops => this.shops = shops);
  }

  createShop(): void {
    this.router.navigate(['/createShop']);
  }

  editShop(shop: Shop): void {
    this.router.navigate(['/editShop', shop.id]);
  }

  deleteShop(shop: Shop): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      data: { message: 'Êtes-vous sûr de vouloir supprimer la boutique ' + shop.name + ' ?' }
    });
  
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.shopService.deleteShop(shop).subscribe(
          () => {
            this.getShops();
            this.openSnackBar('Boutique supprimée avec succès', 'Fermer');
          },
          (error: any) => {
            console.error('Erreur lors de la suppression de la boutique :', error);
          }
        );
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'bottom',
    });
  }
}
