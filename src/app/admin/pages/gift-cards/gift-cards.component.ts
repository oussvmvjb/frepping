import { Component, OnInit } from '@angular/core';
import { AdminGiftCardService } from '../../services/admin-gift-card.service';
import {
  GiftCardResponse,
  GiftCardCreatedAdminResponse,
  GiftCardCreateRequest
} from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss'],
})
export class GiftCardsComponent implements OnInit {
  cards: GiftCardResponse[] = [];
  loading = true;
  error: string | null = null;

  page = 1;
  pageSize = 15;
  total = 0;
  pages = 1;

  // Create Modal
  createModalOpen = false;
  creating = false;
  createError: string | null = null;
  newCard = {
    initial_balance: '50.00',
    currency: 'USD',
    expires_at: '',
  };

  // One-time PIN Reveal
  createdCardResult: GiftCardCreatedAdminResponse | null = null;
  pinCopied = false;
  savedConfirmed = false;

  // Status Toggling
  toggling: { [cardId: string]: boolean } = {};

  constructor(private giftCardService: AdminGiftCardService) {}

  ngOnInit(): void {
    this.fetchCards();
  }

  fetchCards(page = 1): void {
    this.loading = true;
    this.page = page;
    this.error = null;

    this.giftCardService.list(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.cards = res.items || [];
        this.total = res.total;
        this.pages = res.pages;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load gift cards';
        this.loading = false;
      },
    });
  }

  openCreateModal(): void {
    this.newCard = {
      initial_balance: '50.00',
      currency: 'USD',
      expires_at: '',
    };
    this.createError = null;
    this.createdCardResult = null;
    this.pinCopied = false;
    this.savedConfirmed = false;
    this.createModalOpen = true;
  }

  closeCreateModal(): void {
    if (this.createdCardResult && !this.savedConfirmed) {
      return; // Force acknowledgment
    }
    this.createModalOpen = false;
    this.createdCardResult = null;
    this.fetchCards(this.page);
  }

  submitCreate(): void {
    if (!this.newCard.initial_balance || parseFloat(this.newCard.initial_balance) <= 0) {
      this.createError = 'Please enter a valid initial balance';
      return;
    }

    this.creating = true;
    this.createError = null;

    const payload: GiftCardCreateRequest = {
      initial_balance: this.newCard.initial_balance,
      currency: this.newCard.currency || 'USD',
      expires_at: this.newCard.expires_at ? new Date(this.newCard.expires_at).toISOString() : null,
    };

    this.giftCardService.create(payload).subscribe({
      next: (res) => {
        this.createdCardResult = res;
        this.creating = false;
      },
      error: (err) => {
        this.createError = err.error?.detail || err.message || 'Failed to create gift card';
        this.creating = false;
      },
    });
  }

  copyPin(pin: string): void {
    navigator.clipboard.writeText(pin);
    this.pinCopied = true;
    setTimeout(() => (this.pinCopied = false), 2500);
  }

  toggleStatus(card: GiftCardResponse): void {
    this.toggling[card.id] = true;
    const targetStatus = !card.is_active;

    this.giftCardService.update(card.id, { is_active: targetStatus }).subscribe({
      next: (updated) => {
        card.is_active = updated.is_active;
        this.toggling[card.id] = false;
      },
      error: (err) => {
        alert(err.error?.detail || err.message || 'Failed to update gift card status');
        this.toggling[card.id] = false;
      },
    });
  }
}
