import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product-placeholder',
  template: `
    <div class="edit-placeholder-container">
      <div class="placeholder-card">
        <div class="breadcrumb">
          <a routerLink="/admin/products" class="back-link">← Back to Products</a>
        </div>
        <div class="icon-wrap">🛠️</div>
        <h1 class="title">Edit Product</h1>
        <p class="subtitle">
          Editing product ID: <code class="id-tag">{{ productId }}</code>
        </p>
        <div class="info-box">
          <p>
            The dedicated full-page product editor is scheduled for the upcoming development milestone.
            This route has been configured to preserve navigation integrity.
          </p>
        </div>
        <div class="actions">
          <a routerLink="/admin/products" class="btn btn--primary">
            Return to Product List
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .edit-placeholder-container {
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      font-family: 'Poppins', sans-serif;
    }
    .placeholder-card {
      background: #0e1810;
      border: 1px solid rgba(57, 255, 20, 0.2);
      border-radius: 12px;
      padding: 36px 32px;
      max-width: 580px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
    .breadcrumb {
      text-align: left;
      margin-bottom: 24px;
    }
    .back-link {
      color: #39ff14;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: opacity 0.2s;
      &:hover { opacity: 0.8; }
    }
    .icon-wrap {
      font-size: 3rem;
      margin-bottom: 12px;
    }
    .title {
      font-family: 'Oswald', sans-serif;
      font-size: 1.8rem;
      color: #39ff14;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 24px;
    }
    .id-tag {
      background: rgba(57, 255, 20, 0.1);
      border: 1px solid rgba(57, 255, 20, 0.3);
      color: #39ff14;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      word-break: break-all;
    }
    .info-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed rgba(57, 255, 20, 0.2);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 28px;
      color: #ccc;
      font-size: 0.88rem;
      line-height: 1.5;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 22px;
      border-radius: 6px;
      font-family: 'Oswald', sans-serif;
      font-size: 0.95rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      &--primary {
        background: #39ff14;
        color: #0b0f0c;
        box-shadow: 0 0 16px rgba(57, 255, 20, 0.35);
        &:hover {
          background: lighten(#39ff14, 5%);
          box-shadow: 0 0 24px rgba(57, 255, 20, 0.55);
        }
      }
    }
  `]
})
export class EditProductPlaceholderComponent implements OnInit {
  productId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
  }
}
