import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  categories = ['ALL', 'TOPS', 'BOTTOMS', 'SHOES', 'ACCESSORIES'];
  selectedCategory = 'ALL';
  sortOptions = ['NEWEST', 'PRICE LOW-HIGH', 'PRICE HIGH-LOW'];
  selectedSort = 'NEWEST';
  isLoading = true;
}