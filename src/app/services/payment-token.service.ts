import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

export interface TokenizedCard {
  token: string;
  brand: string;
  last4: string;
}

/**
 * PaymentTokenService — mock implementation.
 * TODO: Replace this with Stripe Elements (stripe.js) integration.
 * The real implementation should call stripe.createToken() / stripe.createPaymentMethod()
 * and NEVER receive or store raw card numbers on the frontend.
 */
@Injectable({ providedIn: "root" })
export class PaymentTokenService {
  /**
   * Tokenises card details using the payment provider.
   * Currently returns a fake token for development/testing.
   * Clears card data from memory after tokenisation.
   */
  tokenize(cardData: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  }): Observable<TokenizedCard> {
    // Derive brand/last4 for display ONLY – never sent to backend
    const raw = cardData.number.replace(/\s/g, "");
    const last4 = raw.slice(-4) || "0000";
    const brand = raw.startsWith("4") ? "Visa" : raw.startsWith("5") ? "Mastercard" : "Card";
    const token = `tok_mock_${brand.toLowerCase()}_${last4}_${Date.now()}`;

    // Clear sensitive data immediately (cannot GC, but remove references)
    Object.keys(cardData).forEach(k => ((cardData as any)[k] = ""));

    return of({ token, brand, last4 });
  }
}
