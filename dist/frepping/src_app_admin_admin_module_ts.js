"use strict";
(self["webpackChunkfrepping"] = self["webpackChunkfrepping"] || []).push([["src_app_admin_admin_module_ts"],{

/***/ 4911:
/*!***************************************!*\
  !*** ./src/app/admin/admin.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminModule: () => (/* binding */ AdminModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _admin_routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin.routes */ 249);
/* harmony import */ var _layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout/admin-layout.component */ 5108);
/* harmony import */ var _pages_products_products_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/products/products.component */ 6629);
/* harmony import */ var _pages_categories_list_categories_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/categories-list/categories-list.component */ 8523);
/* harmony import */ var _pages_create_product_create_product_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/create-product/create-product.component */ 2361);
/* harmony import */ var _pages_edit_product_placeholder_edit_product_placeholder_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/edit-product-placeholder/edit-product-placeholder.component */ 2621);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7580);












class AdminModule {
  static {
    this.ɵfac = function AdminModule_Factory(t) {
      return new (t || AdminModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
      type: AdminModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule.forChild(_admin_routes__WEBPACK_IMPORTED_MODULE_0__.adminRoutes)]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AdminModule, {
    declarations: [_layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_1__.AdminLayoutComponent, _pages_products_products_component__WEBPACK_IMPORTED_MODULE_2__.ProductsComponent, _pages_categories_list_categories_list_component__WEBPACK_IMPORTED_MODULE_3__.CategoriesListComponent, _pages_create_product_create_product_component__WEBPACK_IMPORTED_MODULE_4__.CreateProductComponent, _pages_edit_product_placeholder_edit_product_placeholder_component__WEBPACK_IMPORTED_MODULE_5__.EditProductPlaceholderComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule],
    exports: [_pages_products_products_component__WEBPACK_IMPORTED_MODULE_2__.ProductsComponent]
  });
})();

/***/ }),

/***/ 249:
/*!***************************************!*\
  !*** ./src/app/admin/admin.routes.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adminRoutes: () => (/* binding */ adminRoutes)
/* harmony export */ });
/* harmony import */ var _layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout/admin-layout.component */ 5108);
/* harmony import */ var _pages_products_products_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/products/products.component */ 6629);
/* harmony import */ var _pages_create_product_create_product_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/create-product/create-product.component */ 2361);
/* harmony import */ var _pages_categories_list_categories_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/categories-list/categories-list.component */ 8523);
/* harmony import */ var _pages_edit_product_placeholder_edit_product_placeholder_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/edit-product-placeholder/edit-product-placeholder.component */ 2621);
/* harmony import */ var _services_auth_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/auth.guard */ 5438);
/* harmony import */ var _services_role_guard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/role.guard */ 8452);







const adminRoutes = [{
  path: '',
  component: _layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_0__.AdminLayoutComponent,
  canActivate: [_services_auth_guard__WEBPACK_IMPORTED_MODULE_5__.AuthGuard, _services_role_guard__WEBPACK_IMPORTED_MODULE_6__.RoleGuard],
  data: {
    roles: ['ADMIN', 'SUPER_ADMIN']
  },
  children: [{
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }, {
    path: 'products',
    component: _pages_products_products_component__WEBPACK_IMPORTED_MODULE_1__.ProductsComponent
  }, {
    path: 'products/new',
    component: _pages_create_product_create_product_component__WEBPACK_IMPORTED_MODULE_2__.CreateProductComponent
  }, {
    path: 'products/:id/edit',
    component: _pages_edit_product_placeholder_edit_product_placeholder_component__WEBPACK_IMPORTED_MODULE_4__.EditProductPlaceholderComponent
  }, {
    path: 'categories',
    component: _pages_categories_list_categories_list_component__WEBPACK_IMPORTED_MODULE_3__.CategoriesListComponent
  }]
}];

/***/ }),

/***/ 5108:
/*!********************************************************!*\
  !*** ./src/app/admin/layout/admin-layout.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminLayoutComponent: () => (/* binding */ AdminLayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 5072);



const _c0 = function (a0) {
  return {
    exact: a0
  };
};
function AdminLayoutComponent_a_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdminLayoutComponent_a_11_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.navOpen = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const link_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", link_r1.route)("routerLinkActiveOptions", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](4, _c0, link_r1.exact));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](link_r1.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](link_r1.label);
  }
}
const _c1 = function () {
  return {
    exact: true
  };
};
class AdminLayoutComponent {
  constructor() {
    this.navOpen = false;
    this.navLinks = [{
      label: 'All Products',
      icon: '🛍️',
      route: '/admin/products',
      exact: true
    }, {
      label: 'All Categories',
      icon: '🗂️',
      route: '/admin/categories',
      exact: false
    }, {
      label: 'Add Product',
      icon: '＋',
      route: '/admin/products/new',
      exact: true
    }];
  }
  toggleNav() {
    this.navOpen = !this.navOpen;
  }
  static {
    this.ɵfac = function AdminLayoutComponent_Factory(t) {
      return new (t || AdminLayoutComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AdminLayoutComponent,
      selectors: [["app-admin-layout"]],
      decls: 52,
      vars: 5,
      consts: [[1, "admin-shell"], [1, "admin-sidebar"], [1, "sidebar-brand"], [1, "sidebar-brand__logo"], [1, "sidebar-brand__meta"], [1, "sidebar-brand__text"], [1, "sidebar-brand__sub"], ["aria-label", "Admin sidebar navigation", 1, "sidebar-nav"], ["routerLinkActive", "sidebar-nav__link--active", "class", "sidebar-nav__link", 3, "routerLink", "routerLinkActiveOptions", "click", 4, "ngFor", "ngForOf"], [1, "sidebar-footer"], ["routerLink", "/", 1, "sidebar-footer-link"], [1, "footer-icon"], [1, "admin-backdrop", 3, "click"], [1, "admin-main"], [1, "admin-top-navbar"], [1, "top-nav-left"], ["aria-label", "Toggle navigation", 1, "topbar-burger", 3, "click"], [1, "top-brand"], [1, "badge-panel"], [1, "top-title"], ["aria-label", "Quick tabs", 1, "top-nav-links"], ["routerLink", "/admin/products", "routerLinkActive", "top-nav-link--active", 1, "top-nav-link", 3, "routerLinkActiveOptions"], [1, "top-icon"], ["routerLink", "/admin/categories", "routerLinkActive", "top-nav-link--active", 1, "top-nav-link"], ["routerLink", "/admin/products/new", "routerLinkActive", "top-nav-link--active", 1, "top-nav-link", "top-nav-link--cta"], [1, "top-nav-right"], ["routerLink", "/", "title", "Return to storefront", 1, "btn-store-link"], [1, "admin-content"], ["routerLinkActive", "sidebar-nav__link--active", 1, "sidebar-nav__link", 3, "routerLink", "routerLinkActiveOptions", "click"], [1, "sidebar-nav__icon"], [1, "sidebar-nav__label"]],
      template: function AdminLayoutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "FR");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4)(6, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "FREPPING");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "small", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Admin Control");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "nav", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, AdminLayoutComponent_a_11_Template, 5, 6, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 9)(13, "a", 10)(14, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "\u2190");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Back to Store");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdminLayoutComponent_Template_div_click_18_listener() {
            return ctx.navOpen = false;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 13)(20, "header", 14)(21, "div", 15)(22, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdminLayoutComponent_Template_button_click_22_listener() {
            return ctx.toggleNav();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "span")(24, "span")(25, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 17)(27, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "ADMIN");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "DASHBOARD");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "nav", 20)(32, "a", 21)(33, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "\uD83D\uDECD\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "All Products");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "a", 23)(38, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "\uD83D\uDDC2\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "All Categories");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "a", 24)(43, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "\uFF0B");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, "Add Product");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 25)(48, "a", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, " Storefront \u2197 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "main", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](51, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("nav-open", ctx.navOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.navLinks);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLinkActiveOptions", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](4, _c1));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterOutlet, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLinkActive],
      styles: [".admin-shell[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 100vh;\n  background: #0b0f0c;\n  font-family: \"Poppins\", sans-serif;\n  position: relative;\n  cursor: auto !important;\n}\n.admin-shell[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  cursor: auto !important;\n}\n.admin-shell[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   .btn-action[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   .top-nav-link[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   .sidebar-nav__link[_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   .modal-close[_ngcontent-%COMP%] {\n  cursor: pointer !important;\n}\n.admin-shell[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   input[type=number][_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   input[type=url][_ngcontent-%COMP%], .admin-shell[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  cursor: text !important;\n}\n\n.admin-sidebar[_ngcontent-%COMP%] {\n  width: 220px;\n  min-height: 100vh;\n  background: #080d09;\n  border-right: 1px solid rgba(57, 255, 20, 0.14);\n  display: flex;\n  flex-direction: column;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  z-index: 200;\n  transition: transform 0.3s ease;\n}\n@media (max-width: 860px) {\n  .admin-sidebar[_ngcontent-%COMP%] {\n    transform: translateX(-100%);\n  }\n  .nav-open[_ngcontent-%COMP%]   .admin-sidebar[_ngcontent-%COMP%] {\n    transform: translateX(0);\n  }\n}\n\n.sidebar-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 18px 18px;\n  border-bottom: 1px solid rgba(57, 255, 20, 0.14);\n}\n.sidebar-brand__logo[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 6px;\n  background: #39ff14;\n  color: #0b0f0c;\n  font-family: \"Oswald\", sans-serif;\n  font-weight: 900;\n  font-size: 0.95rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 1px;\n  box-shadow: 0 0 14px rgba(57, 255, 20, 0.3);\n  flex-shrink: 0;\n}\n.sidebar-brand__meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.sidebar-brand__text[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.95rem;\n  font-weight: 700;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  color: #39ff14;\n  line-height: 1.1;\n}\n.sidebar-brand__sub[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  color: #888;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n}\n\n.sidebar-nav[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  padding: 12px 10px;\n  gap: 5px;\n}\n.sidebar-nav__link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 12px;\n  border-radius: 6px;\n  text-decoration: none;\n  color: #888;\n  font-size: 0.82rem;\n  font-weight: 500;\n  letter-spacing: 0.5px;\n  transition: all 0.2s;\n  border: 1px solid transparent;\n}\n.sidebar-nav__link[_ngcontent-%COMP%]:hover {\n  background: rgba(57, 255, 20, 0.08);\n  color: #f5f5f5;\n  border-color: rgba(57, 255, 20, 0.15);\n}\n.sidebar-nav__link--active[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.08);\n  color: #39ff14;\n  border-color: rgba(57, 255, 20, 0.3);\n  box-shadow: 0 0 10px rgba(57, 255, 20, 0.08);\n}\n.sidebar-nav__icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  width: 20px;\n  text-align: center;\n  flex-shrink: 0;\n}\n.sidebar-nav__label[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.8rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n}\n\n.sidebar-footer[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  border-top: 1px solid rgba(57, 255, 20, 0.14);\n}\n\n.sidebar-footer-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #888;\n  font-size: 0.78rem;\n  text-decoration: none;\n  letter-spacing: 0.5px;\n  transition: color 0.2s;\n}\n.sidebar-footer-link[_ngcontent-%COMP%]:hover {\n  color: #39ff14;\n}\n\n.admin-backdrop[_ngcontent-%COMP%] {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.7);\n  z-index: 199;\n}\n@media (max-width: 860px) {\n  .nav-open[_ngcontent-%COMP%]   .admin-backdrop[_ngcontent-%COMP%] {\n    display: block;\n  }\n}\n\n.admin-main[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  margin-left: 220px;\n}\n@media (max-width: 860px) {\n  .admin-main[_ngcontent-%COMP%] {\n    margin-left: 0;\n  }\n}\n\n.admin-top-navbar[_ngcontent-%COMP%] {\n  height: 60px;\n  background: #080d09;\n  border-bottom: 1px solid rgba(57, 255, 20, 0.14);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 20px;\n  position: sticky;\n  top: 0;\n  z-index: 150;\n  gap: 16px;\n}\n\n.top-nav-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.topbar-burger[_ngcontent-%COMP%] {\n  display: none;\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 6px;\n  flex-direction: column;\n  gap: 4px;\n}\n.topbar-burger[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  width: 20px;\n  height: 2px;\n  background: #39ff14;\n  border-radius: 2px;\n}\n@media (max-width: 860px) {\n  .topbar-burger[_ngcontent-%COMP%] {\n    display: flex;\n  }\n}\n\n.top-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.top-brand[_ngcontent-%COMP%]   .badge-panel[_ngcontent-%COMP%] {\n  background: #39ff14;\n  color: #0b0f0c;\n  font-size: 0.65rem;\n  font-weight: 800;\n  font-family: \"Oswald\", sans-serif;\n  letter-spacing: 1px;\n  padding: 2px 6px;\n  border-radius: 3px;\n}\n.top-brand[_ngcontent-%COMP%]   .top-title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.85rem;\n  letter-spacing: 1.5px;\n  color: #f5f5f5;\n}\n\n.top-nav-links[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n@media (max-width: 600px) {\n  .top-nav-links[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n\n.top-nav-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 12px;\n  border-radius: 5px;\n  text-decoration: none;\n  color: #888;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.78rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  transition: all 0.2s;\n  border: 1px solid transparent;\n}\n.top-nav-link[_ngcontent-%COMP%]:hover {\n  color: #f5f5f5;\n  background: rgba(255, 255, 255, 0.05);\n}\n.top-nav-link--active[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.08);\n  color: #39ff14;\n  border-color: rgba(57, 255, 20, 0.25);\n}\n.top-nav-link--cta[_ngcontent-%COMP%] {\n  border-color: rgba(57, 255, 20, 0.35);\n  color: #39ff14;\n}\n.top-nav-link--cta[_ngcontent-%COMP%]:hover {\n  background: #39ff14;\n  color: #0b0f0c;\n}\n.top-nav-link[_ngcontent-%COMP%]   .top-icon[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n\n.top-nav-right[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n\n.btn-store-link[_ngcontent-%COMP%] {\n  color: #39ff14;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.78rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  text-decoration: none;\n  padding: 5px 10px;\n  border-radius: 4px;\n  border: 1px solid rgba(57, 255, 20, 0.2);\n  transition: all 0.2s;\n}\n.btn-store-link[_ngcontent-%COMP%]:hover {\n  background: rgba(57, 255, 20, 0.08);\n  border-color: #39ff14;\n}\n\n.admin-content[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYWRtaW4vbGF5b3V0L2FkbWluLWxheW91dC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFnQkE7RUFDRSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFmVTtFQWdCVixrQ0FQVTtFQVFWLGtCQUFBO0VBQ0EsdUJBQUE7QUFmRjtBQWlCRTtFQUNFLHVCQUFBO0FBZko7QUFrQkU7RUFDRSwwQkFBQTtBQWhCSjtBQW1CRTtFQUNFLHVCQUFBO0FBakJKOztBQXNCQTtFQUNFLFlBN0JVO0VBOEJWLGlCQUFBO0VBQ0EsbUJBcENVO0VBcUNWLCtDQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsZUFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsU0FBQTtFQUNBLFlBQUE7RUFDQSwrQkFBQTtBQW5CRjtBQXFCRTtFQWRGO0lBZUksNEJBQUE7RUFsQkY7RUFtQkU7SUFBYyx3QkFBQTtFQWhCaEI7QUFDRjs7QUFvQkE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSxnREFBQTtBQWpCRjtBQW1CRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFyRVE7RUFzRVIsY0FuRVE7RUFvRVIsaUNBNURRO0VBNkRSLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsMkNBQUE7RUFDQSxjQUFBO0FBakJKO0FBb0JFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0FBbEJKO0FBcUJFO0VBQ0UsaUNBN0VRO0VBOEVSLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0E3RlE7RUE4RlIsZ0JBQUE7QUFuQko7QUFzQkU7RUFDRSxrQkFBQTtFQUNBLFdBM0ZRO0VBNEZSLG1CQUFBO0VBQ0EseUJBQUE7QUFwQko7O0FBeUJBO0VBQ0UsT0FBQTtFQUNBLGFBQUE7RUFD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QUFBO0VBQ0EsbUJBQUE7RUFDQSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLHdDQUFBO0VBQ0Esb0JBQUE7QUFqQ0Y7QUFtQ0U7RUFDRSxtQ0EvVVE7RUFnVlIscUJBalZRO0FBZ1RaOztBQXNDQTtFQUNFLE9BQUE7RUFDQSxnQkFBQTtBQW5DRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBWYXJpYWJsZXMgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4kbmVvbjogICAgICAjMzlmZjE0O1xuJG5lb24tZGltOiAgcmdiYSg1NywgMjU1LCAyMCwgMC4wOCk7XG4kbmVvbi1nbG93OiByZ2JhKDU3LCAyNTUsIDIwLCAwLjMpO1xuJGJnLWJvZHk6ICAgIzBiMGYwYztcbiRiZy1zaWRlOiAgICMwODBkMDk7XG4kYmctdG9wYmFyOiAjMDgwZDA5O1xuJGJvcmRlcjogICAgcmdiYSg1NywgMjU1LCAyMCwgMC4xNCk7XG4kd2hpdGU6ICAgICAjZjVmNWY1O1xuJG11dGVkOiAgICAgIzg4ODtcbiRzaWRlYmFyLXc6IDIyMHB4O1xuJHRvcGJhci1oOiAgNjBweDtcbiRmb250LWRpc3A6ICdPc3dhbGQnLCBzYW5zLXNlcmlmO1xuJGZvbnQtYm9keTogJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgU2hlbGwgbGF5b3V0IMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmFkbWluLXNoZWxsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQ6ICRiZy1ib2R5O1xuICBmb250LWZhbWlseTogJGZvbnQtYm9keTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBjdXJzb3I6IGF1dG8gIWltcG9ydGFudDtcblxuICAqIHtcbiAgICBjdXJzb3I6IGF1dG8gIWltcG9ydGFudDtcbiAgfVxuXG4gIGJ1dHRvbiwgYSwgc2VsZWN0LCBpbnB1dFt0eXBlPSdjaGVja2JveCddLCAuYnRuLCAuYnRuLWFjdGlvbiwgLnRvcC1uYXYtbGluaywgLnNpZGViYXItbmF2X19saW5rLCAubW9kYWwtY2xvc2Uge1xuICAgIGN1cnNvcjogcG9pbnRlciAhaW1wb3J0YW50O1xuICB9XG5cbiAgaW5wdXRbdHlwZT0ndGV4dCddLCBpbnB1dFt0eXBlPSdudW1iZXInXSwgaW5wdXRbdHlwZT0ndXJsJ10sIHRleHRhcmVhIHtcbiAgICBjdXJzb3I6IHRleHQgIWltcG9ydGFudDtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgU2lkZWJhciDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5hZG1pbi1zaWRlYmFyIHtcbiAgd2lkdGg6ICRzaWRlYmFyLXc7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICBiYWNrZ3JvdW5kOiAkYmctc2lkZTtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgJGJvcmRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgei1pbmRleDogMjAwO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA4NjBweCkge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XG4gICAgLm5hdi1vcGVuICYgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7IH1cbiAgfVxufVxuXG4vLyBCcmFuZFxuLnNpZGViYXItYnJhbmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEycHg7XG4gIHBhZGRpbmc6IDE4cHggMThweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRib3JkZXI7XG5cbiAgJl9fbG9nbyB7XG4gICAgd2lkdGg6IDM2cHg7XG4gICAgaGVpZ2h0OiAzNnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICBiYWNrZ3JvdW5kOiAkbmVvbjtcbiAgICBjb2xvcjogJGJnLWJvZHk7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgICBmb250LXNpemU6IDAuOTVyZW07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgYm94LXNoYWRvdzogMCAwIDE0cHggJG5lb24tZ2xvdztcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuXG4gICZfX21ldGEge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxuXG4gICZfX3RleHQge1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAycHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBjb2xvcjogJG5lb247XG4gICAgbGluZS1oZWlnaHQ6IDEuMTtcbiAgfVxuXG4gICZfX3N1YiB7XG4gICAgZm9udC1zaXplOiAwLjY1cmVtO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICB9XG59XG5cbi8vIE5hdiBsaW5rc1xuLnNpZGViYXItbmF2IHtcbiAgZmxleDogMTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZzogMTJweCAxMHB4O1xuICBnYXA6IDVweDtcblxuICAmX19saW5rIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxMnB4O1xuICAgIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAkbmVvbi1kaW07XG4gICAgICBjb2xvcjogJHdoaXRlO1xuICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjE1KTtcbiAgICB9XG5cbiAgICAmLS1hY3RpdmUge1xuICAgICAgYmFja2dyb3VuZDogJG5lb24tZGltO1xuICAgICAgY29sb3I6ICRuZW9uO1xuICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjMpO1xuICAgICAgYm94LXNoYWRvdzogMCAwIDEwcHggcmdiYSg1NywgMjU1LCAyMCwgMC4wOCk7XG4gICAgfVxuICB9XG5cbiAgJl9faWNvbiB7XG4gICAgZm9udC1zaXplOiAxcmVtO1xuICAgIHdpZHRoOiAyMHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuXG4gICZfX2xhYmVsIHtcbiAgICBmb250LWZhbWlseTogJGZvbnQtZGlzcDtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIH1cbn1cblxuLy8gU2lkZWJhciBGb290ZXJcbi5zaWRlYmFyLWZvb3RlciB7XG4gIHBhZGRpbmc6IDE0cHggMTZweDtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICRib3JkZXI7XG59XG5cbi5zaWRlYmFyLWZvb3Rlci1saW5rIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiA4cHg7XG4gIGNvbG9yOiAkbXV0ZWQ7XG4gIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnM7XG5cbiAgJjpob3ZlciB7IGNvbG9yOiAkbmVvbjsgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQmFja2Ryb3AgKG1vYmlsZSkgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYWRtaW4tYmFja2Ryb3Age1xuICBkaXNwbGF5OiBub25lO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGluc2V0OiAwO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNyk7XG4gIHotaW5kZXg6IDE5OTtcblxuICAubmF2LW9wZW4gJiB7XG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDg2MHB4KSB7IGRpc3BsYXk6IGJsb2NrOyB9XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIE1haW4gYXJlYSDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5hZG1pbi1tYWluIHtcbiAgZmxleDogMTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIG1hcmdpbi1sZWZ0OiAkc2lkZWJhci13O1xuXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA4NjBweCkgeyBtYXJnaW4tbGVmdDogMDsgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgVG9wIE5hdmJhciDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5hZG1pbi10b3AtbmF2YmFyIHtcbiAgaGVpZ2h0OiAkdG9wYmFyLWg7XG4gIGJhY2tncm91bmQ6ICRiZy10b3BiYXI7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAkYm9yZGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDAgMjBweDtcbiAgcG9zaXRpb246IHN0aWNreTtcbiAgdG9wOiAwO1xuICB6LWluZGV4OiAxNTA7XG4gIGdhcDogMTZweDtcbn1cblxuLnRvcC1uYXYtbGVmdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTJweDtcbn1cblxuLnRvcGJhci1idXJnZXIge1xuICBkaXNwbGF5OiBub25lO1xuICBiYWNrZ3JvdW5kOiBub25lO1xuICBib3JkZXI6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgcGFkZGluZzogNnB4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDRweDtcblxuICBzcGFuIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB3aWR0aDogMjBweDtcbiAgICBoZWlnaHQ6IDJweDtcbiAgICBiYWNrZ3JvdW5kOiAkbmVvbjtcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gIH1cblxuICBAbWVkaWEgKG1heC13aWR0aDogODYwcHgpIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICB9XG59XG5cbi50b3AtYnJhbmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDhweDtcblxuICAuYmFkZ2UtcGFuZWwge1xuICAgIGJhY2tncm91bmQ6ICRuZW9uO1xuICAgIGNvbG9yOiAjMGIwZjBjO1xuICAgIGZvbnQtc2l6ZTogMC42NXJlbTtcbiAgICBmb250LXdlaWdodDogODAwO1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgcGFkZGluZzogMnB4IDZweDtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIH1cblxuICAudG9wLXRpdGxlIHtcbiAgICBmb250LWZhbWlseTogJGZvbnQtZGlzcDtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IDEuNXB4O1xuICAgIGNvbG9yOiAkd2hpdGU7XG4gIH1cbn1cblxuLy8gVG9wIE5hdiBUYWJzXG4udG9wLW5hdi1saW5rcyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogOHB4O1xuXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cblxuLnRvcC1uYXYtbGluayB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogNnB4O1xuICBwYWRkaW5nOiA2cHggMTJweDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiAkbXV0ZWQ7XG4gIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICBmb250LXNpemU6IDAuNzhyZW07XG4gIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzO1xuICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcblxuICAmOmhvdmVyIHtcbiAgICBjb2xvcjogJHdoaXRlO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XG4gIH1cblxuICAmLS1hY3RpdmUge1xuICAgIGJhY2tncm91bmQ6ICRuZW9uLWRpbTtcbiAgICBjb2xvcjogJG5lb247XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjI1KTtcbiAgfVxuXG4gICYtLWN0YSB7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjM1KTtcbiAgICBjb2xvcjogJG5lb247XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6ICRuZW9uO1xuICAgICAgY29sb3I6ICMwYjBmMGM7XG4gICAgfVxuICB9XG5cbiAgLnRvcC1pY29uIHtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgfVxufVxuXG4udG9wLW5hdi1yaWdodCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5idG4tc3RvcmUtbGluayB7XG4gIGNvbG9yOiAkbmVvbjtcbiAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBwYWRkaW5nOiA1cHggMTBweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjIpO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycztcblxuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAkbmVvbi1kaW07XG4gICAgYm9yZGVyLWNvbG9yOiAkbmVvbjtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQ29udGVudCBhcmVhIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmFkbWluLWNvbnRlbnQge1xuICBmbGV4OiAxO1xuICBvdmVyZmxvdy15OiBhdXRvO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 8523:
/*!**************************************************************************!*\
  !*** ./src/app/admin/pages/categories-list/categories-list.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CategoriesListComponent: () => (/* binding */ CategoriesListComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_admin_product_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/admin-product.service */ 971);
/* harmony import */ var _services_category_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../services/category.service */ 4354);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 4456);







function CategoriesListComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx_r0.filteredCategories.length, " categories");
  }
}
function CategoriesListComponent_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_13_div_1_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r9.successMessage = null);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r7.successMessage, " ");
  }
}
function CategoriesListComponent_div_13_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_13_div_2_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r11.errorMessage = null);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r8.errorMessage, " ");
  }
}
function CategoriesListComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CategoriesListComponent_div_13_div_1_Template, 4, 1, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CategoriesListComponent_div_13_div_2_Template, 4, 1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.successMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.errorMessage);
  }
}
function CategoriesListComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Loading categories...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function CategoriesListComponent_div_20_div_1_tr_15_img_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 48);
  }
  if (rf & 2) {
    const cat_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", cat_r17.image_url, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"])("alt", cat_r17.name);
  }
}
function CategoriesListComponent_div_20_div_1_tr_15_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "\uD83C\uDFF7\uFE0F");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_20_div_1_tr_15_span_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const cat_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](cat_r17.description);
  }
}
function CategoriesListComponent_div_20_div_1_tr_15_span_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "\u2014");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_20_div_1_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "tr")(1, "td", 33)(2, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CategoriesListComponent_div_20_div_1_tr_15_img_3_Template, 1, 2, "img", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CategoriesListComponent_div_20_div_1_tr_15_span_4_Template, 2, 0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 37)(6, "span", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "span", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "td", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, CategoriesListComponent_div_20_div_1_tr_15_span_11_Template, 2, 1, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](12, CategoriesListComponent_div_20_div_1_tr_15_span_12_Template, 2, 0, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "td")(14, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "td", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](18, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "td", 45)(20, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_20_div_1_tr_15_Template_button_click_20_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r25);
      const cat_r17 = restoredCtx.$implicit;
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r24.openEditModal(cat_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, " \u270F\uFE0F Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_20_div_1_tr_15_Template_button_click_22_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r25);
      const cat_r17 = restoredCtx.$implicit;
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r26.openDeleteConfirm(cat_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, " \uD83D\uDDD1\uFE0F Delete ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const cat_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", cat_r17.image_url);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !cat_r17.image_url);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](cat_r17.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("/", cat_r17.slug, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", cat_r17.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !cat_r17.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("status-tag--active", cat_r17.is_active);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", cat_r17.is_active ? "Active" : "Disabled", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](18, 10, cat_r17.created_at, "shortDate"), " ");
  }
}
function CategoriesListComponent_div_20_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 29)(1, "table", 30)(2, "thead")(3, "tr")(4, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "Created");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "th", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, CategoriesListComponent_div_20_div_1_tr_15_Template, 24, 13, "tr", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r13.filteredCategories);
  }
}
function CategoriesListComponent_div_20_ng_template_2_p_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "No categories match your search terms.");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_20_ng_template_2_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "You haven't added any categories yet.");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_20_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 52)(1, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "\uD83D\uDDC2\uFE0F");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "No Categories Found");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, CategoriesListComponent_div_20_ng_template_2_p_5_Template, 2, 0, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, CategoriesListComponent_div_20_ng_template_2_p_6_Template, 2, 0, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_20_ng_template_2_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r30);
      const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r29.openCreateModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "+ Create Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r15.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r15.searchTerm);
  }
}
function CategoriesListComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CategoriesListComponent_div_20_div_1_Template, 16, 1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CategoriesListComponent_div_20_ng_template_2_Template, 9, 2, "ng-template", null, 28, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r3.filteredCategories.length > 0)("ngIfElse", _r14);
  }
}
function CategoriesListComponent_div_21_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r31.createError);
  }
}
function CategoriesListComponent_div_21_span_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Create Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_21_span_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Creating...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_21_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r34.closeCreateModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_21_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 58)(3, "h2", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "New Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_21_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r37.closeCreateModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, CategoriesListComponent_div_21_div_8_Template, 2, 1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 62)(10, "div", 63)(11, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Category Name *");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "input", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_21_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r38.createForm.name = $event);
    })("input", function CategoriesListComponent_div_21_Template_input_input_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r39.onCreateNameChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 63)(15, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "URL Slug *");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "input", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_21_Template_input_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r40.createForm.slug = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 63)(19, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Banner / Thumbnail Image URL");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_21_Template_input_ngModelChange_21_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r41.createForm.image_url = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "div", 63)(23, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "textarea", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_21_Template_textarea_ngModelChange_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r42.createForm.description = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div", 69)(27, "label", 70)(28, "input", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_21_Template_input_ngModelChange_28_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r43.createForm.is_active = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, "Active and visible");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](31, "div", 72)(32, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_21_Template_button_click_32_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r44.closeCreateModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](33, "Cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "button", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_21_Template_button_click_34_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r35);
      const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r45.submitCreate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](35, CategoriesListComponent_div_21_span_35_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](36, CategoriesListComponent_div_21_span_36_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r4.createError);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r4.createForm.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r4.createForm.slug);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r4.createForm.image_url);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r4.createForm.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r4.createForm.is_active);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r4.isCreating);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r4.isCreating);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r4.isCreating);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r4.isCreating);
  }
}
function CategoriesListComponent_div_22_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r46.editError);
  }
}
function CategoriesListComponent_div_22_span_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Save Changes");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_22_span_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Updating...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_22_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r49.closeEditModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_22_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 58)(3, "h2", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Edit Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_22_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r52.closeEditModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, CategoriesListComponent_div_22_div_8_Template, 2, 1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 62)(10, "div", 63)(11, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Category Name *");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_22_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r53.editForm.name = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 63)(15, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "URL Slug *");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_22_Template_input_ngModelChange_17_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r54.editForm.slug = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 63)(19, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Banner / Thumbnail Image URL");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "input", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_22_Template_input_ngModelChange_21_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r55.editForm.image_url = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "div", 63)(23, "label", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "textarea", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_22_Template_textarea_ngModelChange_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r56.editForm.description = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div", 69)(27, "label", 70)(28, "input", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_div_22_Template_input_ngModelChange_28_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r57.editForm.is_active = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, "Active and visible");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](31, "div", 72)(32, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_22_Template_button_click_32_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r58.closeEditModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](33, "Cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "button", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_22_Template_button_click_34_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r50);
      const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r59.submitEdit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](35, CategoriesListComponent_div_22_span_35_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](36, CategoriesListComponent_div_22_span_36_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r5.editError);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r5.editForm.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r5.editForm.slug);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r5.editForm.image_url);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r5.editForm.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r5.editForm.is_active);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r5.isUpdating);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r5.isUpdating);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r5.isUpdating);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r5.isUpdating);
  }
}
function CategoriesListComponent_div_23_span_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Yes, Delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_23_span_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Deleting...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CategoriesListComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r63 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_23_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r63);
      const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r62.closeDeleteConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_23_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 58)(3, "h2", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Delete Category?");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_23_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r63);
      const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r65.closeDeleteConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 61)(8, "p", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, " Are you sure you want to delete category: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](10, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "strong", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "? ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "p", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "Products linked to this category may need to be updated. This cannot be undone.");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 72)(17, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_23_Template_button_click_17_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r63);
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r66.closeDeleteConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_div_23_Template_button_click_19_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r63);
      const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r67.confirmDelete());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](20, CategoriesListComponent_div_23_span_20_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](21, CategoriesListComponent_div_23_span_21_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("\"", ctx_r6.categoryToDelete.name, "\"");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r6.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r6.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r6.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r6.isDeleting);
  }
}
class CategoriesListComponent {
  constructor(adminService, categoryService) {
    this.adminService = adminService;
    this.categoryService = categoryService;
    this.categories = [];
    this.filteredCategories = [];
    this.isLoading = false;
    this.errorMessage = null;
    this.successMessage = null;
    this.searchTerm = '';
    // ── Create Modal State ──
    this.showCreateModal = false;
    this.createForm = {
      name: '',
      slug: '',
      description: null,
      image_url: null,
      is_active: true
    };
    this.isCreating = false;
    this.createError = null;
    // ── Edit Modal State ──
    this.categoryToEdit = null;
    this.editForm = {};
    this.isUpdating = false;
    this.editError = null;
    // ── Delete Modal State ──
    this.categoryToDelete = null;
    this.isDeleting = false;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  }
  ngOnInit() {
    this.loadCategories();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadCategories() {
    this.isLoading = true;
    this.errorMessage = null;
    this.adminService.getCategories().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: cats => {
        this.categories = cats;
        this.applyFilter();
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCategories = this.categories.filter(c => {
      return !term || c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term) || c.description && c.description.toLowerCase().includes(term);
    });
  }
  // ── Auto-slug for Create ──
  onCreateNameChange() {
    if (!this.createForm.slug || this.createForm.slug === this.slugify(this.createForm.name.slice(0, -1))) {
      this.createForm.slug = this.slugify(this.createForm.name);
    }
  }
  slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  }
  // ── Create Modal ──
  openCreateModal() {
    this.createForm = {
      name: '',
      slug: '',
      description: null,
      image_url: null,
      is_active: true
    };
    this.createError = null;
    this.showCreateModal = true;
  }
  closeCreateModal() {
    this.showCreateModal = false;
    this.isCreating = false;
    this.createError = null;
  }
  submitCreate() {
    if (!this.createForm.name.trim() || !this.createForm.slug.trim()) {
      this.createError = 'Category Name and Slug are required.';
      return;
    }
    this.isCreating = true;
    this.createError = null;
    const payload = {
      name: this.createForm.name.trim(),
      slug: this.createForm.slug.trim(),
      description: this.createForm.description?.trim() || null,
      image_url: this.createForm.image_url?.trim() || null,
      is_active: this.createForm.is_active
    };
    this.adminService.createCategory(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: created => {
        this.categories.unshift(created);
        this.applyFilter();
        this.categoryService.invalidateCache();
        this.successMessage = `Category "${created.name}" created successfully.`;
        this.closeCreateModal();
      },
      error: err => {
        this.createError = err.message;
        this.isCreating = false;
      }
    });
  }
  // ── Edit Modal ──
  openEditModal(category) {
    this.categoryToEdit = category;
    this.editError = null;
    this.editForm = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url,
      is_active: category.is_active
    };
  }
  closeEditModal() {
    this.categoryToEdit = null;
    this.isUpdating = false;
    this.editError = null;
  }
  submitEdit() {
    if (!this.categoryToEdit) return;
    if (!this.editForm.name?.trim() || !this.editForm.slug?.trim()) {
      this.editError = 'Category Name and Slug are required.';
      return;
    }
    this.isUpdating = true;
    this.editError = null;
    const payload = {
      name: this.editForm.name.trim(),
      slug: this.editForm.slug.trim(),
      description: this.editForm.description?.trim() || null,
      image_url: this.editForm.image_url?.trim() || null,
      is_active: this.editForm.is_active
    };
    this.adminService.updateCategory(this.categoryToEdit.id, payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: updated => {
        const index = this.categories.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          this.categories[index] = updated;
        }
        this.applyFilter();
        this.categoryService.invalidateCache();
        this.successMessage = `Category "${updated.name}" updated successfully.`;
        this.closeEditModal();
      },
      error: err => {
        this.editError = err.message;
        this.isUpdating = false;
      }
    });
  }
  // ── Delete Modal ──
  openDeleteConfirm(category) {
    this.categoryToDelete = category;
    this.errorMessage = null;
    this.successMessage = null;
  }
  closeDeleteConfirm() {
    this.categoryToDelete = null;
    this.isDeleting = false;
  }
  confirmDelete() {
    if (!this.categoryToDelete) return;
    this.isDeleting = true;
    const id = this.categoryToDelete.id;
    const name = this.categoryToDelete.name;
    this.adminService.deleteCategory(id).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.applyFilter();
        this.categoryService.invalidateCache();
        this.successMessage = `Category "${name}" was deleted successfully.`;
        this.closeDeleteConfirm();
      },
      error: err => {
        this.errorMessage = `Failed to delete category: ${err.message}`;
        this.isDeleting = false;
      }
    });
  }
  static {
    this.ɵfac = function CategoriesListComponent_Factory(t) {
      return new (t || CategoriesListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_admin_product_service__WEBPACK_IMPORTED_MODULE_0__.AdminProductService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_category_service__WEBPACK_IMPORTED_MODULE_1__.CategoryService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: CategoriesListComponent,
      selectors: [["app-categories-list"]],
      decls: 24,
      vars: 9,
      consts: [[1, "admin-container"], [1, "admin-page-header"], [1, "header-left"], [1, "header-title"], [1, "header-icon"], ["class", "count-badge", 4, "ngIf"], [1, "header-actions"], ["title", "Refresh", 1, "btn", "btn--outline", 3, "disabled", "click"], [1, "btn", "btn--primary", 3, "click"], ["class", "admin-alerts", 4, "ngIf"], [1, "filter-toolbar"], [1, "search-box"], [1, "search-icon"], ["type", "text", "placeholder", "Search categories by name, slug, description...", 1, "form-input", 3, "ngModel", "ngModelChange", "input"], ["class", "loading-state", 4, "ngIf"], ["class", "table-card", 4, "ngIf"], ["class", "modal-backdrop", 3, "click", 4, "ngIf"], [1, "count-badge"], [1, "admin-alerts"], ["class", "alert alert--success", 4, "ngIf"], ["class", "alert alert--error", 4, "ngIf"], [1, "alert", "alert--success"], [1, "alert-close", 3, "click"], [1, "alert", "alert--error"], [1, "loading-state"], [1, "spinner"], [1, "table-card"], ["class", "table-responsive", 4, "ngIf", "ngIfElse"], ["noCategories", ""], [1, "table-responsive"], [1, "admin-table"], [1, "text-right"], [4, "ngFor", "ngForOf"], [1, "category-cell"], [1, "cat-thumb"], ["onerror", "this.style.display='none'", 3, "src", "alt", 4, "ngIf"], ["class", "no-img", 4, "ngIf"], [1, "cat-meta"], [1, "cat-name"], [1, "cat-slug"], [1, "desc-cell"], ["class", "desc-text", 4, "ngIf"], ["class", "desc-empty", 4, "ngIf"], [1, "status-tag"], [1, "date-cell"], [1, "text-right", "actions-cell"], ["title", "Edit category", 1, "btn-action", "btn-action--edit", 3, "click"], ["title", "Delete category", 1, "btn-action", "btn-action--delete", 3, "click"], ["onerror", "this.style.display='none'", 3, "src", "alt"], [1, "no-img"], [1, "desc-text"], [1, "desc-empty"], [1, "empty-box"], [1, "empty-icon"], [4, "ngIf"], [1, "btn", "btn--primary", "mt-12", 3, "click"], [1, "modal-backdrop", 3, "click"], [1, "modal-card", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "modal-close", 3, "click"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], ["type", "text", "placeholder", "e.g. Streetwear", 1, "form-input", 3, "ngModel", "ngModelChange", "input"], ["type", "text", "placeholder", "e.g. streetwear", 1, "form-input", 3, "ngModel", "ngModelChange"], ["type", "url", "placeholder", "https://example.com/banner.jpg", 1, "form-input", 3, "ngModel", "ngModelChange"], ["rows", "3", "placeholder", "Optional category description...", 1, "form-input", "form-input--textarea", 3, "ngModel", "ngModelChange"], [1, "form-row", "form-row--toggles"], [1, "toggle-control"], ["type", "checkbox", 3, "ngModel", "ngModelChange"], [1, "modal-footer"], [1, "btn", "btn--outline", 3, "disabled", "click"], [1, "btn", "btn--primary", 3, "disabled", "click"], ["type", "text", 1, "form-input", 3, "ngModel", "ngModelChange"], ["rows", "3", 1, "form-input", "form-input--textarea", 3, "ngModel", "ngModelChange"], [1, "modal-card", "modal-card--sm", 3, "click"], [1, "modal-title", "modal-title--danger"], [1, "delete-warning"], [1, "highlight-title"], [1, "delete-sub"], [1, "btn", "btn--danger", 3, "disabled", "click"]],
      template: function CategoriesListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3)(4, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "\uD83D\uDDC2\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, " Categories ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, CategoriesListComponent_span_7_Template, 2, 1, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 6)(9, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_Template_button_click_9_listener() {
            return ctx.loadCategories();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " \u21BB Refresh ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CategoriesListComponent_Template_button_click_11_listener() {
            return ctx.openCreateModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, " + Add Category ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, CategoriesListComponent_div_13_Template, 3, 2, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 10)(15, "div", 11)(16, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "\uD83D\uDD0D");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "input", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function CategoriesListComponent_Template_input_ngModelChange_18_listener($event) {
            return ctx.searchTerm = $event;
          })("input", function CategoriesListComponent_Template_input_input_18_listener() {
            return ctx.applyFilter();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](19, CategoriesListComponent_div_19_Template, 4, 0, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](20, CategoriesListComponent_div_20_Template, 4, 2, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](21, CategoriesListComponent_div_21_Template, 37, 10, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](22, CategoriesListComponent_div_22_Template, 37, 10, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](23, CategoriesListComponent_div_23_Template, 22, 5, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.successMessage || ctx.errorMessage);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.searchTerm);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showCreateModal);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.categoryToEdit);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.categoryToDelete);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_5__.DatePipe],
      styles: [".admin-container[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1200px;\n  margin: 0 auto;\n  font-family: \"Poppins\", sans-serif;\n}\n\n.admin-page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.admin-page-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.admin-page-header[_ngcontent-%COMP%]   .header-title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: clamp(1.4rem, 3vw, 1.9rem);\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  color: #39ff14;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  text-shadow: 0 0 16px rgba(57, 255, 20, 0.35);\n}\n.admin-page-header[_ngcontent-%COMP%]   .count-badge[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.08);\n  border: 1px solid rgba(57, 255, 20, 0.3);\n  color: #39ff14;\n  font-size: 0.75rem;\n  font-family: \"Oswald\", sans-serif;\n  letter-spacing: 1px;\n  padding: 3px 10px;\n  border-radius: 20px;\n  text-transform: uppercase;\n}\n.admin-page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.filter-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  margin-bottom: 20px;\n}\n.filter-toolbar[_ngcontent-%COMP%]   .search-box[_ngcontent-%COMP%] {\n  flex: 1;\n  max-width: 400px;\n  position: relative;\n}\n.filter-toolbar[_ngcontent-%COMP%]   .search-box[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 0.85rem;\n  pointer-events: none;\n  opacity: 0.6;\n}\n.filter-toolbar[_ngcontent-%COMP%]   .search-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  padding-left: 36px;\n}\n\n.table-card[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);\n}\n\n.table-responsive[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\n.admin-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.88rem;\n}\n.admin-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #080d09;\n  border-bottom: 1px solid rgba(57, 255, 20, 0.15);\n}\n.admin-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.78rem;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  color: #aaa;\n  font-weight: 600;\n}\n.admin-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(57, 255, 20, 0.08);\n  transition: background 0.2s;\n}\n.admin-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: rgba(57, 255, 20, 0.04);\n}\n.admin-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  vertical-align: middle;\n}\n\n.category-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  min-width: 200px;\n}\n\n.cat-thumb[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 6px;\n  background: #111;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.cat-thumb[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.cat-thumb[_ngcontent-%COMP%]   .no-img[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  opacity: 0.6;\n}\n\n.cat-meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.cat-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #f5f5f5;\n}\n\n.cat-slug[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #aaa;\n}\n\n.desc-cell[_ngcontent-%COMP%] {\n  max-width: 320px;\n}\n.desc-cell[_ngcontent-%COMP%]   .desc-text[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  color: #ccc;\n  font-size: 0.82rem;\n  line-height: 1.4;\n}\n.desc-cell[_ngcontent-%COMP%]   .desc-empty[_ngcontent-%COMP%] {\n  color: #555;\n}\n\n.status-tag[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  padding: 3px 8px;\n  border-radius: 4px;\n  display: inline-block;\n  background: rgba(255, 255, 255, 0.08);\n  color: #aaa;\n}\n.status-tag--active[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.12);\n  color: #39ff14;\n  border: 1px solid rgba(57, 255, 20, 0.3);\n}\n\n.date-cell[_ngcontent-%COMP%] {\n  color: #aaa;\n  font-size: 0.8rem;\n  white-space: nowrap;\n}\n\n.actions-cell[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n\n.btn-action[_ngcontent-%COMP%] {\n  background: none;\n  border: 1px solid transparent;\n  padding: 6px 10px;\n  border-radius: 5px;\n  font-size: 0.78rem;\n  cursor: pointer;\n  margin-left: 6px;\n  transition: all 0.2s;\n  font-family: \"Oswald\", sans-serif;\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n}\n.btn-action--edit[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.08);\n  border-color: rgba(57, 255, 20, 0.25);\n  color: #39ff14;\n}\n.btn-action--edit[_ngcontent-%COMP%]:hover {\n  background: rgba(57, 255, 20, 0.18);\n  box-shadow: 0 0 8px rgba(57, 255, 20, 0.2);\n}\n.btn-action--delete[_ngcontent-%COMP%] {\n  background: rgba(255, 59, 59, 0.08);\n  border-color: rgba(255, 59, 59, 0.25);\n  color: #ff3b3b;\n}\n.btn-action--delete[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 59, 59, 0.2);\n  box-shadow: 0 0 8px rgba(255, 59, 59, 0.2);\n}\n\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 14px;\n}\n\n.form-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.78rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  color: #aaa;\n  margin-bottom: 6px;\n}\n\n.form-input[_ngcontent-%COMP%] {\n  background: #0b1209;\n  border: 1px solid rgba(57, 255, 20, 0.2);\n  border-radius: 6px;\n  color: #f5f5f5;\n  font-family: \"Poppins\", sans-serif;\n  font-size: 0.88rem;\n  padding: 9px 12px;\n  width: 100%;\n  outline: none;\n  transition: border-color 0.2s, box-shadow 0.2s;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  border-color: #39ff14;\n  box-shadow: 0 0 8px rgba(57, 255, 20, 0.15);\n}\n.form-input--textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 14px;\n}\n.form-row--toggles[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  margin-top: 10px;\n}\n\n.toggle-control[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.82rem;\n  color: #f5f5f5;\n  cursor: pointer;\n}\n.toggle-control[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  accent-color: #39ff14;\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n\n.btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  font-family: \"Oswald\", sans-serif;\n  font-weight: 700;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  padding: 8px 16px;\n  border-radius: 6px;\n  font-size: 0.85rem;\n  cursor: pointer;\n  border: none;\n  text-decoration: none;\n  transition: all 0.2s;\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #39ff14;\n  color: #0b0f0c;\n}\n.btn--primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2ee000;\n  box-shadow: 0 0 14px rgba(57, 255, 20, 0.35);\n  transform: translateY(-1px);\n}\n.btn--outline[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1px solid rgba(57, 255, 20, 0.35);\n  color: #39ff14;\n}\n.btn--outline[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: rgba(57, 255, 20, 0.08);\n  border-color: #39ff14;\n}\n.btn--danger[_ngcontent-%COMP%] {\n  background: #ff3b3b;\n  color: #f5f5f5;\n}\n.btn--danger[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #e62e2e;\n  box-shadow: 0 0 14px rgba(255, 59, 59, 0.4);\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.mt-12[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n\n.admin-alerts[_ngcontent-%COMP%] {\n  margin-bottom: 18px;\n}\n\n.alert[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  border-radius: 6px;\n  font-size: 0.85rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 8px;\n}\n.alert--success[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.08);\n  border-left: 3px solid #39ff14;\n  color: #39ff14;\n}\n.alert--error[_ngcontent-%COMP%] {\n  background: rgba(255, 59, 59, 0.08);\n  border-left: 3px solid #ff3b3b;\n  color: #ff3b3b;\n}\n.alert[_ngcontent-%COMP%]   .alert-close[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: inherit;\n  font-size: 0.9rem;\n  cursor: pointer;\n  opacity: 0.7;\n}\n.alert[_ngcontent-%COMP%]   .alert-close[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n\n.loading-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: #aaa;\n}\n.loading-state[_ngcontent-%COMP%]   .spinner[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border: 3px solid rgba(57, 255, 20, 0.2);\n  border-top-color: #39ff14;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.8s linear infinite;\n  margin: 0 auto 14px;\n}\n\n.empty-box[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 50px 20px;\n}\n.empty-box[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 12px;\n}\n.empty-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  color: #f5f5f5;\n  font-size: 1.2rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  margin-bottom: 6px;\n}\n.empty-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #aaa;\n  font-size: 0.85rem;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.75);\n  backdrop-filter: blur(4px);\n  z-index: 500;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n}\n\n.modal-card[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(57, 255, 20, 0.3);\n  border-radius: 10px;\n  width: 100%;\n  max-width: 540px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(57, 255, 20, 0.1);\n}\n.modal-card--sm[_ngcontent-%COMP%] {\n  max-width: 440px;\n}\n\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 20px;\n  border-bottom: 1px solid rgba(57, 255, 20, 0.15);\n}\n.modal-header[_ngcontent-%COMP%]   .modal-title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 1.2rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  color: #39ff14;\n}\n.modal-header[_ngcontent-%COMP%]   .modal-title--danger[_ngcontent-%COMP%] {\n  color: #ff3b3b;\n}\n.modal-header[_ngcontent-%COMP%]   .modal-close[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #aaa;\n  font-size: 1.1rem;\n  cursor: pointer;\n}\n.modal-header[_ngcontent-%COMP%]   .modal-close[_ngcontent-%COMP%]:hover {\n  color: #f5f5f5;\n}\n\n.modal-body[_ngcontent-%COMP%] {\n  padding: 20px;\n}\n.modal-body[_ngcontent-%COMP%]   .delete-warning[_ngcontent-%COMP%] {\n  color: #f5f5f5;\n  font-size: 0.95rem;\n  line-height: 1.5;\n  margin-bottom: 8px;\n}\n.modal-body[_ngcontent-%COMP%]   .highlight-title[_ngcontent-%COMP%] {\n  color: #39ff14;\n}\n.modal-body[_ngcontent-%COMP%]   .delete-sub[_ngcontent-%COMP%] {\n  color: #aaa;\n  font-size: 0.8rem;\n}\n\n.modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 10px;\n  padding: 14px 20px;\n  border-top: 1px solid rgba(57, 255, 20, 0.15);\n  background: rgba(0, 0, 0, 0.2);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYWRtaW4vcGFnZXMvY2F0ZWdvcmllcy1saXN0L2NhdGVnb3JpZXMtbGlzdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFhQTtFQUNFLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7RUFDQSxrQ0FOVTtBQU5aOztBQWdCQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsU0FBQTtBQWJGO0FBZUU7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0FBYko7QUFnQkU7RUFDRSxpQ0ExQlE7RUEyQlIscUNBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0F4Q0c7RUF5Q0gsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLDZDQUFBO0FBZEo7QUFpQkU7RUFDRSxtQ0EvQ087RUFnRFAsd0NBQUE7RUFDQSxjQWxERztFQW1ESCxrQkFBQTtFQUNBLGlDQTFDUTtFQTJDUixtQkFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSx5QkFBQTtBQWZKO0FBa0JFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtBQWhCSjs7QUFxQkE7RUFDRSxhQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0FBbEJGO0FBb0JFO0VBQ0UsT0FBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7QUFsQko7QUFvQkk7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxRQUFBO0VBQ0EsMkJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsWUFBQTtBQWxCTjtBQXFCSTtFQUNFLGtCQUFBO0FBbkJOOztBQXlCQTtFQUNFLG1CQTVGUTtFQTZGUix5Q0FBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSx5Q0FBQTtBQXRCRjs7QUF5QkE7RUFDRSxnQkFBQTtBQXRCRjs7QUF5QkE7RUFDRSxXQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtFQUNB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Q29udGVudCI6WyIkbmVvbjogIzM5ZmYxNDtcbiRuZW9uLWRpbTogcmdiYSg1NywgMjU1LCAyMCwgMC4wOCk7XG4kbmVvbi1nbG93OiByZ2JhKDU3LCAyNTUsIDIwLCAwLjM1KTtcbiRiZy1jYXJkOiAjMGUxODEwO1xuJGJnLWlucHV0OiAjMGIxMjA5O1xuJGJvcmRlcjogcmdiYSg1NywgMjU1LCAyMCwgMC4xNSk7XG4kcmVkOiAjZmYzYjNiO1xuJG9yYW5nZTogI2ZmOTkwMDtcbiR3aGl0ZTogI2Y1ZjVmNTtcbiRtdXRlZDogI2FhYTtcbiRmb250LWRpc3A6ICdPc3dhbGQnLCBzYW5zLXNlcmlmO1xuJGZvbnQtYm9keTogJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuXG4uYWRtaW4tY29udGFpbmVyIHtcbiAgcGFkZGluZzogMjRweDtcbiAgbWF4LXdpZHRoOiAxMjAwcHg7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBmb250LWZhbWlseTogJGZvbnQtYm9keTtcbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIEhlYWRlciDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5hZG1pbi1wYWdlLWhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDE2cHg7XG5cbiAgLmhlYWRlci1sZWZ0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxNHB4O1xuICB9XG5cbiAgLmhlYWRlci10aXRsZSB7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgZm9udC1zaXplOiBjbGFtcCgxLjRyZW0sIDN2dywgMS45cmVtKTtcbiAgICBsZXR0ZXItc3BhY2luZzogMnB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY29sb3I6ICRuZW9uO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEwcHg7XG4gICAgdGV4dC1zaGFkb3c6IDAgMCAxNnB4ICRuZW9uLWdsb3c7XG4gIH1cblxuICAuY291bnQtYmFkZ2Uge1xuICAgIGJhY2tncm91bmQ6ICRuZW9uLWRpbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjMpO1xuICAgIGNvbG9yOiAkbmVvbjtcbiAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgICBwYWRkaW5nOiAzcHggMTBweDtcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIH1cblxuICAuaGVhZGVyLWFjdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEwcHg7XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIEZpbHRlciBUb29sYmFyIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmZpbHRlci10b29sYmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAxNHB4O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuXG4gIC5zZWFyY2gtYm94IHtcbiAgICBmbGV4OiAxO1xuICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgLnNlYXJjaC1pY29uIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDEycHg7XG4gICAgICB0b3A6IDUwJTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgb3BhY2l0eTogMC42O1xuICAgIH1cblxuICAgIGlucHV0IHtcbiAgICAgIHBhZGRpbmctbGVmdDogMzZweDtcbiAgICB9XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIFRhYmxlIENhcmQgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4udGFibGUtY2FyZCB7XG4gIGJhY2tncm91bmQ6ICRiZy1jYXJkO1xuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMCwgMCwgMCwgMC40KTtcbn1cblxuLnRhYmxlLXJlc3BvbnNpdmUge1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuXG4uYWRtaW4tdGFibGUge1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgZm9udC1zaXplOiAwLjg4cmVtO1xuXG4gIHRoZWFkIHRyIHtcbiAgICBiYWNrZ3JvdW5kOiAjMDgwZDA5O1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAkYm9yZGVyO1xuICB9XG5cbiAgdGgge1xuICAgIHBhZGRpbmc6IDE0cHggMTZweDtcbiAgICBmb250LWZhbWlseTogJGZvbnQtZGlzcDtcbiAgICBmb250LXNpemU6IDAuNzhyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IDEuNXB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY29sb3I6ICRtdXRlZDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG5cbiAgdGJvZHkgdHIge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjA4KTtcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMnM7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoNTcsIDI1NSwgMjAsIDAuMDQpO1xuICAgIH1cbiAgfVxuXG4gIHRkIHtcbiAgICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQ2F0ZWdvcnkgQ2VsbCDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5jYXRlZ29yeS1jZWxsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMnB4O1xuICBtaW4td2lkdGg6IDIwMHB4O1xufVxuXG4uY2F0LXRodW1iIHtcbiAgd2lkdGg6IDQwcHg7XG4gIGhlaWdodDogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBiYWNrZ3JvdW5kOiAjMTExO1xuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZmxleC1zaHJpbms6IDA7XG5cbiAgaW1nIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgb2JqZWN0LWZpdDogY292ZXI7XG4gIH1cblxuICAubm8taW1nIHtcbiAgICBmb250LXNpemU6IDEuMXJlbTtcbiAgICBvcGFjaXR5OiAwLjY7XG4gIH1cbn1cblxuLmNhdC1tZXRhIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAycHg7XG59XG5cbi5jYXQtbmFtZSB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAkd2hpdGU7XG59XG5cbi5jYXQtc2x1ZyB7XG4gIGZvbnQtc2l6ZTogMC43MnJlbTtcbiAgY29sb3I6ICRtdXRlZDtcbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIERlc2MgQ2VsbCDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5kZXNjLWNlbGwge1xuICBtYXgtd2lkdGg6IDMyMHB4O1xuXG4gIC5kZXNjLXRleHQge1xuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgIC13ZWJraXQtbGluZS1jbGFtcDogMjtcbiAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgY29sb3I6ICNjY2M7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIH1cblxuICAuZGVzYy1lbXB0eSB7XG4gICAgY29sb3I6ICM1NTU7XG4gIH1cbn1cblxuLnN0YXR1cy10YWcge1xuICBmb250LXNpemU6IDAuN3JlbTtcbiAgcGFkZGluZzogM3B4IDhweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XG4gIGNvbG9yOiAkbXV0ZWQ7XG5cbiAgJi0tYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjEyKTtcbiAgICBjb2xvcjogJG5lb247XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSg1NywgMjU1LCAyMCwgMC4zKTtcbiAgfVxufVxuXG4uZGF0ZS1jZWxsIHtcbiAgY29sb3I6ICRtdXRlZDtcbiAgZm9udC1zaXplOiAwLjhyZW07XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBBY3Rpb25zIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmFjdGlvbnMtY2VsbCB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG5cbi50ZXh0LXJpZ2h0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbi5idG4tYWN0aW9uIHtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBtYXJnaW4tbGVmdDogNnB4O1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycztcbiAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblxuICAmLS1lZGl0IHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjA4KTtcbiAgICBib3JkZXItY29sb3I6IHJnYmEoNTcsIDI1NSwgMjAsIDAuMjUpO1xuICAgIGNvbG9yOiAkbmVvbjtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogcmdiYSg1NywgMjU1LCAyMCwgMC4xOCk7XG4gICAgICBib3gtc2hhZG93OiAwIDAgOHB4IHJnYmEoNTcsIDI1NSwgMjAsIDAuMik7XG4gICAgfVxuICB9XG5cbiAgJi0tZGVsZXRlIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgNTksIDU5LCAwLjA4KTtcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCA1OSwgNTksIDAuMjUpO1xuICAgIGNvbG9yOiAkcmVkO1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgNTksIDU5LCAwLjIpO1xuICAgICAgYm94LXNoYWRvdzogMCAwIDhweCByZ2JhKDI1NSwgNTksIDU5LCAwLjIpO1xuICAgIH1cbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRm9ybXMgLyBJbnB1dHMgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uZm9ybS1ncm91cCB7XG4gIG1hcmdpbi1ib3R0b206IDE0cHg7XG59XG5cbi5mb3JtLWxhYmVsIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgY29sb3I6ICRtdXRlZDtcbiAgbWFyZ2luLWJvdHRvbTogNnB4O1xufVxuXG4uZm9ybS1pbnB1dCB7XG4gIGJhY2tncm91bmQ6ICRiZy1pbnB1dDtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSg1NywgMjU1LCAyMCwgMC4yKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBjb2xvcjogJHdoaXRlO1xuICBmb250LWZhbWlseTogJGZvbnQtYm9keTtcbiAgZm9udC1zaXplOiAwLjg4cmVtO1xuICBwYWRkaW5nOiA5cHggMTJweDtcbiAgd2lkdGg6IDEwMCU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzLCBib3gtc2hhZG93IDAuMnM7XG5cbiAgJjpmb2N1cyB7XG4gICAgYm9yZGVyLWNvbG9yOiAkbmVvbjtcbiAgICBib3gtc2hhZG93OiAwIDAgOHB4IHJnYmEoNTcsIDI1NSwgMjAsIDAuMTUpO1xuICB9XG5cbiAgJi0tdGV4dGFyZWEge1xuICAgIHJlc2l6ZTogdmVydGljYWw7XG4gIH1cbn1cblxuLmZvcm0tcm93IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICBnYXA6IDE0cHg7XG5cbiAgJi0tdG9nZ2xlcyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDIwcHg7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgfVxufVxuXG4udG9nZ2xlLWNvbnRyb2wge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDhweDtcbiAgZm9udC1zaXplOiAwLjgycmVtO1xuICBjb2xvcjogJHdoaXRlO1xuICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgaW5wdXRbdHlwZT0nY2hlY2tib3gnXSB7XG4gICAgYWNjZW50LWNvbG9yOiAkbmVvbjtcbiAgICB3aWR0aDogMTZweDtcbiAgICBoZWlnaHQ6IDE2cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBCdXR0b25zIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmJ0biB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZ2FwOiA2cHg7XG4gIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICBmb250LXdlaWdodDogNzAwO1xuICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBwYWRkaW5nOiA4cHggMTZweDtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBmb250LXNpemU6IDAuODVyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYm9yZGVyOiBub25lO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzO1xuXG4gICYtLXByaW1hcnkge1xuICAgIGJhY2tncm91bmQ6ICRuZW9uO1xuICAgIGNvbG9yOiAjMGIwZjBjO1xuXG4gICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjMmVlMDAwO1xuICAgICAgYm94LXNoYWRvdzogMCAwIDE0cHggJG5lb24tZ2xvdztcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcbiAgICB9XG4gIH1cblxuICAmLS1vdXRsaW5lIHtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjM1KTtcbiAgICBjb2xvcjogJG5lb247XG5cbiAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgIGJhY2tncm91bmQ6ICRuZW9uLWRpbTtcbiAgICAgIGJvcmRlci1jb2xvcjogJG5lb247XG4gICAgfVxuICB9XG5cbiAgJi0tZGFuZ2VyIHtcbiAgICBiYWNrZ3JvdW5kOiAkcmVkO1xuICAgIGNvbG9yOiAkd2hpdGU7XG5cbiAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgIGJhY2tncm91bmQ6ICNlNjJlMmU7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMTRweCByZ2JhKDI1NSwgNTksIDU5LCAwLjQpO1xuICAgIH1cbiAgfVxuXG4gICY6ZGlzYWJsZWQge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICB9XG59XG5cbi5tdC0xMiB7XG4gIG1hcmdpbi10b3A6IDEycHg7XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBBbGVydHMgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYWRtaW4tYWxlcnRzIHtcbiAgbWFyZ2luLWJvdHRvbTogMThweDtcbn1cblxuLmFsZXJ0IHtcbiAgcGFkZGluZzogMTBweCAxNHB4O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG5cbiAgJi0tc3VjY2VzcyB7XG4gICAgYmFja2dyb3VuZDogcmdiYSg1NywgMjU1LCAyMCwgMC4wOCk7XG4gICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAkbmVvbjtcbiAgICBjb2xvcjogJG5lb247XG4gIH1cblxuICAmLS1lcnJvciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDU5LCA1OSwgMC4wOCk7XG4gICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAkcmVkO1xuICAgIGNvbG9yOiAkcmVkO1xuICB9XG5cbiAgLmFsZXJ0LWNsb3NlIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjb2xvcjogaW5oZXJpdDtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgb3BhY2l0eTogMC43O1xuICAgICY6aG92ZXIgeyBvcGFjaXR5OiAxOyB9XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIExvYWRpbmcgJiBFbXB0eSDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5sb2FkaW5nLXN0YXRlIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nOiA2MHB4IDIwcHg7XG4gIGNvbG9yOiAkbXV0ZWQ7XG5cbiAgLnNwaW5uZXIge1xuICAgIHdpZHRoOiAzNnB4O1xuICAgIGhlaWdodDogMzZweDtcbiAgICBib3JkZXI6IDNweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjIpO1xuICAgIGJvcmRlci10b3AtY29sb3I6ICRuZW9uO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBhbmltYXRpb246IHNwaW4gMC44cyBsaW5lYXIgaW5maW5pdGU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMTRweDtcbiAgfVxufVxuXG4uZW1wdHktYm94IHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nOiA1MHB4IDIwcHg7XG5cbiAgLmVtcHR5LWljb24ge1xuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xuICAgIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIH1cblxuICBoMyB7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgY29sb3I6ICR3aGl0ZTtcbiAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgbWFyZ2luLWJvdHRvbTogNnB4O1xuICB9XG5cbiAgcCB7XG4gICAgY29sb3I6ICRtdXRlZDtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gIH1cbn1cblxuQGtleWZyYW1lcyBzcGluIHtcbiAgdG8geyB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyB9XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBNb2RhbCDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5tb2RhbC1iYWNrZHJvcCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgaW5zZXQ6IDA7XG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC43NSk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xuICB6LWluZGV4OiA1MDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nOiAyMHB4O1xufVxuXG4ubW9kYWwtY2FyZCB7XG4gIGJhY2tncm91bmQ6ICMwZTE4MTA7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoNTcsIDI1NSwgMjAsIDAuMyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDU0MHB4O1xuICBtYXgtaGVpZ2h0OiA5MHZoO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBib3gtc2hhZG93OiAwIDEwcHggNDBweCByZ2JhKDAsIDAsIDAsIDAuOCksIDAgMCAyMHB4IHJnYmEoNTcsIDI1NSwgMjAsIDAuMSk7XG5cbiAgJi0tc20ge1xuICAgIG1heC13aWR0aDogNDQwcHg7XG4gIH1cbn1cblxuLm1vZGFsLWhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgcGFkZGluZzogMThweCAyMHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJGJvcmRlcjtcblxuICAubW9kYWwtdGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBjb2xvcjogJG5lb247XG5cbiAgICAmLS1kYW5nZXIge1xuICAgICAgY29sb3I6ICRyZWQ7XG4gICAgfVxuICB9XG5cbiAgLm1vZGFsLWNsb3NlIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjb2xvcjogJG11dGVkO1xuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAmOmhvdmVyIHsgY29sb3I6ICR3aGl0ZTsgfVxuICB9XG59XG5cbi5tb2RhbC1ib2R5IHtcbiAgcGFkZGluZzogMjBweDtcblxuICAuZGVsZXRlLXdhcm5pbmcge1xuICAgIGNvbG9yOiAkd2hpdGU7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICB9XG5cbiAgLmhpZ2hsaWdodC10aXRsZSB7XG4gICAgY29sb3I6ICRuZW9uO1xuICB9XG5cbiAgLmRlbGV0ZS1zdWIge1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgZm9udC1zaXplOiAwLjhyZW07XG4gIH1cbn1cblxuLm1vZGFsLWZvb3RlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIGdhcDogMTBweDtcbiAgcGFkZGluZzogMTRweCAyMHB4O1xuICBib3JkZXItdG9wOiAxcHggc29saWQgJGJvcmRlcjtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjIpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 2361:
/*!************************************************************************!*\
  !*** ./src/app/admin/pages/create-product/create-product.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateProductComponent: () => (/* binding */ CreateProductComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_admin_product_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/admin-product.service */ 971);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 5072);








function CreateProductComponent_div_12_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r15.successMessage);
  }
}
function CreateProductComponent_div_12_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r16.errorMessage);
  }
}
function CreateProductComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, CreateProductComponent_div_12_div_1_Template, 2, 1, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, CreateProductComponent_div_12_div_2_Template, 2, 1, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.successMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.errorMessage);
  }
}
function CreateProductComponent_span_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Name is required (max 255 characters). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_span_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Slug is required (max 255 characters). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_option_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const cat_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", cat_r17.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](cat_r17.name);
  }
}
function CreateProductComponent_span_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Category is required.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_span_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CreateProductComponent_span_50_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r18.loadCategories());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Retry");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx_r5.categoryError, " ");
  }
}
function CreateProductComponent_span_80_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Price is required and must be \u2265 0. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_div_90_div_1_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Valid URL is required.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_div_90_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 65)(1, "div", 66)(2, "span", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CreateProductComponent_div_90_div_1_Template_button_click_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25);
      const i_r22 = restoredCtx.index;
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r24.removeImage(i_r22));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 13)(7, "div", 14)(8, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Image URL ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "input", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, CreateProductComponent_div_90_div_1_span_13_Template, 2, 0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 19)(15, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Sort Order");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "input", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 13)(19, "div", 14)(20, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Alt Text");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "input", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "div", 73)(24, "label", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "span", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Primary Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const i_r22 = ctx.index;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroupName", i_r22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Image ", i_r22 + 1, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", "Remove image " + (i_r22 + 1));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "img-url-" + i_r22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx_r20.isImageFieldInvalid(i_r22, "image_url"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "img-url-" + i_r22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r20.isImageFieldInvalid(i_r22, "image_url"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "img-sort-" + i_r22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "img-sort-" + i_r22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "img-alt-" + i_r22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "img-alt-" + i_r22);
  }
}
function CreateProductComponent_div_90_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, CreateProductComponent_div_90_div_1_Template, 28, 12, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r7.images.controls);
  }
}
function CreateProductComponent_ng_template_91_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "No images added yet. Add at least one image below.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_div_100_div_1_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "SKU is required.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_div_100_div_1_span_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Stock must be \u2265 0.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_div_100_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 65)(1, "div", 66)(2, "span", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CreateProductComponent_div_100_div_1_Template_button_click_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32);
      const i_r28 = restoredCtx.index;
      const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r31.removeVariant(i_r28));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 13)(7, "div", 19)(8, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "SKU ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "input", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, CreateProductComponent_div_100_div_1_span_13_Template, 2, 0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 19)(15, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Size");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "input", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 19)(19, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Color");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "input", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "div", 13)(23, "div", 19)(24, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, "Stock ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "input", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](29, CreateProductComponent_div_100_div_1_span_29_Template, 2, 0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 19)(31, "label", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "Price Override ($)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](33, "input", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 73)(35, "label", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](36, "input", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "span", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, "Active");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const i_r28 = ctx.index;
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroupName", i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Variant ", i_r28 + 1, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", "Remove variant " + (i_r28 + 1));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "var-sku-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx_r26.isVariantFieldInvalid(i_r28, "sku"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "var-sku-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r26.isVariantFieldInvalid(i_r28, "sku"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "var-size-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "var-size-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "var-color-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "var-color-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "var-stock-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx_r26.isVariantFieldInvalid(i_r28, "stock"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "var-stock-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r26.isVariantFieldInvalid(i_r28, "stock"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("for", "var-price-" + i_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("id", "var-price-" + i_r28);
  }
}
function CreateProductComponent_div_100_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, CreateProductComponent_div_100_div_1_Template, 39, 19, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r10.variants.controls);
  }
}
function CreateProductComponent_ng_template_101_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "No variants added yet. Add size/color variants below.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_span_107_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Create Product");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CreateProductComponent_span_108_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " Creating\u2026 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class CreateProductComponent {
  constructor(fb, adminService) {
    this.fb = fb;
    this.adminService = adminService;
    this.categories = [];
    this.isLoadingCategories = false;
    this.categoryError = null;
    this.isSubmitting = false;
    this.successMessage = null;
    this.errorMessage = null;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    this.productForm = this.buildForm();
  }
  ngOnInit() {
    this.loadCategories();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // ─── Form construction ────────────────────────────────────────────────────
  buildForm() {
    return this.fb.group({
      name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.maxLength(255)]],
      slug: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.maxLength(255)]],
      description: [''],
      category_id: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      price: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.min(0)]],
      compare_price: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.min(0)],
      material: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.maxLength(255)],
      is_active: [true],
      is_featured: [false],
      images: this.fb.array([]),
      variants: this.fb.array([])
    });
  }
  // ─── Getters ──────────────────────────────────────────────────────────────
  get images() {
    return this.productForm.get('images');
  }
  get variants() {
    return this.productForm.get('variants');
  }
  // ─── Field helpers ────────────────────────────────────────────────────────
  isFieldInvalid(controlName) {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  isVariantFieldInvalid(variantIndex, fieldName) {
    const control = this.variants.at(variantIndex)?.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  isImageFieldInvalid(imageIndex, fieldName) {
    const control = this.images.at(imageIndex)?.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  // ─── Slug auto-generation from name ──────────────────────────────────────
  onNameInput() {
    const nameVal = this.productForm.get('name')?.value || '';
    const slugControl = this.productForm.get('slug');
    if (slugControl && !slugControl.dirty) {
      const slug = nameVal.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      slugControl.setValue(slug);
    }
  }
  // ─── Categories ───────────────────────────────────────────────────────────
  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryError = null;
    this.adminService.getCategories().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: cats => {
        this.categories = cats;
        this.isLoadingCategories = false;
      },
      error: err => {
        this.categoryError = err.message;
        this.isLoadingCategories = false;
      }
    });
  }
  // ─── Images FormArray ─────────────────────────────────────────────────────
  createImageGroup() {
    return this.fb.group({
      image_url: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      alt_text: [''],
      sort_order: [0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.min(0)],
      is_primary: [false]
    });
  }
  addImage() {
    this.images.push(this.createImageGroup());
  }
  removeImage(index) {
    this.images.removeAt(index);
  }
  // ─── Variants FormArray ───────────────────────────────────────────────────
  createVariantGroup() {
    return this.fb.group({
      size: [''],
      color: [''],
      sku: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.maxLength(100)]],
      stock: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.min(0)]],
      price: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.min(0)],
      is_active: [true]
    });
  }
  addVariant() {
    this.variants.push(this.createVariantGroup());
  }
  removeVariant(index) {
    this.variants.removeAt(index);
  }
  // ─── Submit ───────────────────────────────────────────────────────────────
  onSubmit() {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.errorMessage = 'Please fix the errors in the form before submitting.';
      return;
    }
    const raw = this.productForm.getRawValue();
    const payload = {
      name: raw.name.trim(),
      slug: raw.slug.trim(),
      description: raw.description?.trim() || null,
      price: Number(raw.price),
      compare_price: raw.compare_price != null ? Number(raw.compare_price) : null,
      material: raw.material?.trim() || null,
      is_active: raw.is_active,
      is_featured: raw.is_featured,
      category_id: raw.category_id,
      images: raw.images.map(img => ({
        image_url: img.image_url.trim(),
        alt_text: img.alt_text?.trim() || null,
        sort_order: Number(img.sort_order) || 0,
        is_primary: img.is_primary
      })),
      variants: raw.variants.map(v => ({
        size: v.size?.trim() || null,
        color: v.color?.trim() || null,
        sku: v.sku.trim(),
        stock: Number(v.stock),
        price: v.price != null ? Number(v.price) : null,
        is_active: v.is_active
      }))
    };
    this.isSubmitting = true;
    this.adminService.createProduct(payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        this.isSubmitting = false;
        this.successMessage = `✅ Product "${response.name}" created successfully!`;
        this.productForm = this.buildForm();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
      }
    });
  }
  static {
    this.ɵfac = function CreateProductComponent_Factory(t) {
      return new (t || CreateProductComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_admin_product_service__WEBPACK_IMPORTED_MODULE_0__.AdminProductService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: CreateProductComponent,
      selectors: [["app-create-product"]],
      decls: 109,
      vars: 24,
      consts: [[1, "admin-page"], [1, "admin-header"], [1, "admin-header__inner"], [1, "admin-header__top-row"], [1, "admin-header__title"], [1, "admin-header__icon"], ["routerLink", "/admin/products", 1, "btn", "btn--outline", "btn--sm"], [1, "admin-header__subtitle"], ["class", "admin-alerts", 4, "ngIf"], ["id", "create-product-form", "novalidate", "", 1, "admin-form", 3, "formGroup", "ngSubmit"], [1, "form-section"], [1, "form-section__title"], [1, "form-section__num"], [1, "form-row"], [1, "form-group", "form-group--two-thirds"], ["for", "field-name", 1, "form-label"], [1, "required"], ["id", "field-name", "type", "text", "formControlName", "name", "placeholder", "e.g. Classic Linen T-Shirt", 1, "form-input", 3, "input"], ["class", "form-error", 4, "ngIf"], [1, "form-group", "form-group--one-third"], ["for", "field-slug", 1, "form-label"], ["id", "field-slug", "type", "text", "formControlName", "slug", "placeholder", "e.g. classic-linen-t-shirt", 1, "form-input"], [1, "form-group"], ["for", "field-description", 1, "form-label"], ["id", "field-description", "formControlName", "description", "rows", "4", "placeholder", "Detailed product description\u2026", 1, "form-input", "form-input--textarea"], [1, "form-group", "form-group--half"], ["for", "field-category", 1, "form-label"], [1, "select-wrapper"], ["id", "field-category", "formControlName", "category_id", 1, "form-input", "form-input--select"], ["value", "", "disabled", ""], [3, "value", 4, "ngFor", "ngForOf"], ["for", "field-material", 1, "form-label"], ["id", "field-material", "type", "text", "formControlName", "material", "placeholder", "e.g. 100% Organic Cotton", 1, "form-input"], [1, "form-row", "form-row--toggles"], ["for", "toggle-active", 1, "toggle-label"], [1, "toggle-label__text"], [1, "toggle-switch"], ["id", "toggle-active", "type", "checkbox", "formControlName", "is_active", 1, "toggle-switch__input"], [1, "toggle-switch__slider"], ["for", "toggle-featured", 1, "toggle-label"], ["id", "toggle-featured", "type", "checkbox", "formControlName", "is_featured", 1, "toggle-switch__input"], ["for", "field-price", 1, "form-label"], ["id", "field-price", "type", "number", "formControlName", "price", "placeholder", "0.00", "min", "0", "step", "0.01", 1, "form-input"], ["for", "field-compare-price", 1, "form-label"], ["id", "field-compare-price", "type", "number", "formControlName", "compare_price", "placeholder", "0.00 (optional)", "min", "0", "step", "0.01", 1, "form-input"], ["formArrayName", "images", "class", "dynamic-list", 4, "ngIf", "ngIfElse"], ["noImages", ""], ["type", "button", "id", "btn-add-image", 1, "btn", "btn--outline", "btn--add", 3, "click"], ["formArrayName", "variants", "class", "dynamic-list", 4, "ngIf", "ngIfElse"], ["noVariants", ""], ["type", "button", "id", "btn-add-variant", 1, "btn", "btn--outline", "btn--add", 3, "click"], [1, "form-actions"], ["type", "submit", "id", "btn-submit-product", 1, "btn", "btn--primary", "btn--lg", 3, "disabled"], [4, "ngIf"], ["class", "spinner-text", 4, "ngIf"], [1, "admin-alerts"], ["class", "alert alert--success", 4, "ngIf"], ["class", "alert alert--error", 4, "ngIf"], [1, "alert", "alert--success"], [1, "alert", "alert--error"], [1, "form-error"], [3, "value"], ["type", "button", 1, "link-btn", 3, "click"], ["formArrayName", "images", 1, "dynamic-list"], ["class", "dynamic-item", 3, "formGroupName", 4, "ngFor", "ngForOf"], [1, "dynamic-item", 3, "formGroupName"], [1, "dynamic-item__header"], [1, "dynamic-item__badge"], ["type", "button", 1, "btn", "btn--icon", "btn--danger", 3, "click"], [1, "form-label", 3, "for"], ["type", "url", "formControlName", "image_url", "placeholder", "https://example.com/image.jpg", 1, "form-input", 3, "id"], ["type", "number", "formControlName", "sort_order", "min", "0", "placeholder", "0", 1, "form-input", 3, "id"], ["type", "text", "formControlName", "alt_text", "placeholder", "Descriptive text for accessibility", 1, "form-input", 3, "id"], [1, "form-group", "form-group--one-third", "form-group--center"], [1, "checkbox-label"], ["type", "checkbox", "formControlName", "is_primary", 1, "checkbox-input"], [1, "checkbox-text"], [1, "empty-state"], ["formArrayName", "variants", 1, "dynamic-list"], ["type", "text", "formControlName", "sku", "placeholder", "e.g. SHIRT-BLK-M", 1, "form-input", 3, "id"], ["type", "text", "formControlName", "size", "placeholder", "e.g. S, M, L, XL", 1, "form-input", 3, "id"], ["type", "text", "formControlName", "color", "placeholder", "e.g. Black, #1a1a1a", 1, "form-input", 3, "id"], ["type", "number", "formControlName", "stock", "min", "0", "placeholder", "0", 1, "form-input", 3, "id"], ["type", "number", "formControlName", "price", "min", "0", "step", "0.01", "placeholder", "Leave blank to use base price", 1, "form-input", 3, "id"], ["type", "checkbox", "formControlName", "is_active", 1, "checkbox-input"], [1, "spinner-text"], [1, "spinner"]],
      template: function CreateProductComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4)(5, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "\uD83D\uDECD\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, " New Product ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " \u2190 Back to Inventory ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Fill in all required fields and add images & variants.");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, CreateProductComponent_div_12_Template, 3, 2, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "form", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function CreateProductComponent_Template_form_ngSubmit_13_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "section", 10)(15, "h2", 11)(16, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "01");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, " Basic Info ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div", 13)(20, "div", 14)(21, "label", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Product Name ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "input", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("input", function CreateProductComponent_Template_input_input_25_listener() {
            return ctx.onNameInput();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](26, CreateProductComponent_span_26_Template, 2, 0, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 19)(28, "label", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, "URL Slug ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](32, "input", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](33, CreateProductComponent_span_33_Template, 2, 0, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 22)(35, "label", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "Description");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](37, "textarea", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 13)(39, "div", 25)(40, "label", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Category ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "div", 27)(45, "select", 28)(46, "option", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](48, CreateProductComponent_option_48_Template, 2, 2, "option", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](49, CreateProductComponent_span_49_Template, 2, 0, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](50, CreateProductComponent_span_50_Template, 4, 1, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "div", 25)(52, "label", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](53, "Material");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](54, "input", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "div", 33)(56, "label", 34)(57, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](58, "Active");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](60, "input", 37)(61, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "label", 39)(63, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](64, "Featured");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](66, "input", 40)(67, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](68, "section", 10)(69, "h2", 11)(70, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](71, "02");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](72, " Pricing ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "div", 13)(74, "div", 25)(75, "label", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](76, "Price ($) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](77, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](78, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](79, "input", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](80, CreateProductComponent_span_80_Template, 2, 0, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](81, "div", 25)(82, "label", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](83, "Compare-at Price ($)");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](84, "input", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](85, "section", 10)(86, "h2", 11)(87, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](88, "03");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](89, " Product Images ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](90, CreateProductComponent_div_90_Template, 2, 1, "div", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](91, CreateProductComponent_ng_template_91_Template, 2, 0, "ng-template", null, 46, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](93, "button", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CreateProductComponent_Template_button_click_93_listener() {
            return ctx.addImage();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](94, " + Add Image ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](95, "section", 10)(96, "h2", 11)(97, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](98, "04");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](99, " Product Variants ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](100, CreateProductComponent_div_100_Template, 2, 1, "div", 48);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](101, CreateProductComponent_ng_template_101_Template, 2, 0, "ng-template", null, 49, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](103, "button", 50);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CreateProductComponent_Template_button_click_103_listener() {
            return ctx.addVariant();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](104, " + Add Variant ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](105, "div", 51)(106, "button", 52);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](107, CreateProductComponent_span_107_Template, 2, 0, "span", 53);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](108, CreateProductComponent_span_108_Template, 3, 0, "span", 54);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](92);
          const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](102);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.successMessage || ctx.errorMessage);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.productForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx.isFieldInvalid("name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isFieldInvalid("name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx.isFieldInvalid("slug"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isFieldInvalid("slug"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx.isFieldInvalid("category_id"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.isLoadingCategories ? "Loading categories\u2026" : "\u2014 Select category \u2014", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.categories);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isFieldInvalid("category_id"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.categoryError);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("form-input--error", ctx.isFieldInvalid("price"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isFieldInvalid("price"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.images.length > 0)("ngIfElse", _r8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.variants.length > 0)("ngIfElse", _r11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.isSubmitting);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isSubmitting);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isSubmitting);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormArrayName, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink],
      styles: ["@charset \"UTF-8\";\n.admin-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #0b0f0c;\n  padding: 0 0 80px;\n  font-family: \"Poppins\", sans-serif;\n}\n\n.admin-header[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #0e1810 0%, #111c14 100%);\n  border-bottom: 1px solid rgba(57, 255, 20, 0.15);\n  padding: 32px 24px 28px;\n  position: relative;\n  overflow: hidden;\n}\n.admin-header[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.18) 50%);\n  background-size: 100% 4px;\n  pointer-events: none;\n  opacity: 0.25;\n}\n.admin-header__inner[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n}\n.admin-header__top-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-bottom: 6px;\n}\n.admin-header__title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: clamp(1.6rem, 4vw, 2.4rem);\n  font-weight: 700;\n  color: #39ff14;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  text-shadow: 0 0 18px rgba(57, 255, 20, 0.35), 0 0 40px rgba(57, 255, 20, 0.15);\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 6px;\n}\n.admin-header__icon[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.35));\n}\n.admin-header__subtitle[_ngcontent-%COMP%] {\n  color: #aaa;\n  font-size: 0.9rem;\n  letter-spacing: 0.5px;\n}\n\n.admin-alerts[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 16px 24px 0;\n}\n\n.alert[_ngcontent-%COMP%] {\n  padding: 14px 18px;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  margin-bottom: 12px;\n  border-left: 4px solid;\n  animation: fadeInUp 0.4s ease;\n}\n.alert--success[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.06);\n  border-left-color: #39ff14;\n  color: #39ff14;\n  box-shadow: 0 0 12px rgba(57, 255, 20, 0.08);\n}\n.alert--error[_ngcontent-%COMP%] {\n  background: rgba(255, 59, 59, 0.06);\n  border-left-color: #ff3b3b;\n  color: #ff3b3b;\n  box-shadow: 0 0 12px rgba(255, 59, 59, 0.08);\n}\n\n.admin-form[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 24px 24px 0;\n}\n\n.form-section[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 12px;\n  padding: 28px;\n  margin-bottom: 20px;\n  position: relative;\n  transition: border-color 0.3s;\n}\n.form-section[_ngcontent-%COMP%]:hover {\n  border-color: rgba(57, 255, 20, 0.3);\n}\n.form-section__title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.85rem;\n  letter-spacing: 3px;\n  text-transform: uppercase;\n  color: #aaa;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 24px;\n}\n.form-section__num[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  background: rgba(57, 255, 20, 0.08);\n  border: 1px solid #39ff14;\n  color: #39ff14;\n  font-size: 0.7rem;\n  font-weight: 700;\n  box-shadow: 0 0 8px rgba(57, 255, 20, 0.18);\n}\n\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n  margin-bottom: 0;\n}\n.form-row--toggles[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n  margin-top: 8px;\n}\n\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-bottom: 16px;\n}\n.form-group--half[_ngcontent-%COMP%] { \n }\n.form-group--two-thirds[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n.form-group--one-third[_ngcontent-%COMP%] { \n }\n.form-group--center[_ngcontent-%COMP%] {\n  justify-content: center;\n  align-items: flex-start;\n}\n@media (max-width: 640px) {\n  .form-group--two-thirds[_ngcontent-%COMP%] {\n    grid-column: span 1;\n  }\n}\n\n.form-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: #aaa;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n\n.required[_ngcontent-%COMP%] {\n  color: #39ff14;\n  margin-left: 2px;\n}\n\n.form-input[_ngcontent-%COMP%] {\n  background: #0b1209;\n  border: 1px solid rgba(57, 255, 20, 0.2);\n  border-radius: 8px;\n  color: #f5f5f5;\n  font-family: \"Poppins\", sans-serif;\n  font-size: 0.92rem;\n  padding: 11px 14px;\n  transition: border-color 0.25s, box-shadow 0.25s;\n  width: 100%;\n  outline: none;\n  appearance: none;\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #555;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  border-color: #39ff14;\n  box-shadow: 0 0 0 3px rgba(57, 255, 20, 0.12), 0 0 12px rgba(57, 255, 20, 0.08);\n  outline: none;\n}\n.form-input--error[_ngcontent-%COMP%] {\n  border-color: #ff3b3b !important;\n  box-shadow: 0 0 0 3px rgba(255, 59, 59, 0.12) !important;\n}\n.form-input--textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 100px;\n  line-height: 1.6;\n}\n.form-input--select[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.form-input--select[_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {\n  background: #111;\n  color: #f5f5f5;\n}\n\ninput[type=number][_ngcontent-%COMP%]::-webkit-inner-spin-button, input[type=number][_ngcontent-%COMP%]::-webkit-outer-spin-button {\n  opacity: 0.5;\n  filter: invert(1);\n}\n\n.select-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.select-wrapper[_ngcontent-%COMP%]::after {\n  content: \"\u25BE\";\n  position: absolute;\n  right: 14px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #39ff14;\n  pointer-events: none;\n  font-size: 0.85rem;\n}\n.select-wrapper[_ngcontent-%COMP%]   .form-input--select[_ngcontent-%COMP%] {\n  padding-right: 36px;\n}\n\n.form-error[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #ff3b3b;\n  margin-top: -2px;\n}\n\n.toggle-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: #111c14;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 8px;\n  padding: 12px 14px;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  gap: 12px;\n  transition: border-color 0.25s;\n}\n.toggle-label[_ngcontent-%COMP%]:hover {\n  border-color: rgba(57, 255, 20, 0.35);\n}\n.toggle-label__text[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: #f5f5f5;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n\n.toggle-switch[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-block;\n  width: 44px;\n  height: 24px;\n  flex-shrink: 0;\n}\n.toggle-switch__input[_ngcontent-%COMP%] {\n  opacity: 0;\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n.toggle-switch__input[_ngcontent-%COMP%]:checked    + .toggle-switch__slider[_ngcontent-%COMP%] {\n  background: #39ff14;\n  box-shadow: 0 0 10px rgba(57, 255, 20, 0.35);\n}\n.toggle-switch__input[_ngcontent-%COMP%]:checked    + .toggle-switch__slider[_ngcontent-%COMP%]::before {\n  transform: translateX(20px);\n  background: #0b0f0c;\n}\n.toggle-switch__slider[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: #1a2a1a;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 24px;\n  transition: background 0.25s;\n  cursor: pointer;\n}\n.toggle-switch__slider[_ngcontent-%COMP%]::before {\n  content: \"\";\n  position: absolute;\n  width: 18px;\n  height: 18px;\n  left: 3px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: #aaa;\n  border-radius: 50%;\n  transition: transform 0.25s;\n}\n\n.checkbox-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  cursor: pointer;\n  margin-top: 24px;\n}\n\n.checkbox-input[_ngcontent-%COMP%] {\n  appearance: none;\n  width: 18px;\n  height: 18px;\n  border: 1.5px solid rgba(57, 255, 20, 0.4);\n  border-radius: 4px;\n  background: #0b1209;\n  cursor: pointer;\n  flex-shrink: 0;\n  position: relative;\n  transition: background 0.2s, border-color 0.2s;\n}\n.checkbox-input[_ngcontent-%COMP%]:checked {\n  background: #39ff14;\n  border-color: #39ff14;\n}\n.checkbox-input[_ngcontent-%COMP%]:checked::after {\n  content: \"\u2713\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 11px;\n  font-weight: 700;\n  color: #0b0f0c;\n}\n\n.checkbox-text[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: #f5f5f5;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n\n.dynamic-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n\n.dynamic-item[_ngcontent-%COMP%] {\n  background: #111c14;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 8px;\n  padding: 20px;\n  position: relative;\n  animation: fadeInUp 0.3s ease;\n  transition: border-color 0.25s;\n}\n.dynamic-item[_ngcontent-%COMP%]:hover {\n  border-color: rgba(57, 255, 20, 0.3);\n}\n.dynamic-item__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 16px;\n}\n.dynamic-item__badge[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  font-weight: 700;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  color: #39ff14;\n  font-family: \"Oswald\", sans-serif;\n}\n\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #555;\n  font-size: 0.88rem;\n  padding: 20px 0 12px;\n  font-style: italic;\n}\n\n.btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  font-family: \"Oswald\", sans-serif;\n  font-weight: 700;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.25s ease;\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #39ff14;\n  color: #0b0f0c;\n  font-size: 1rem;\n  padding: 14px 36px;\n}\n.btn--primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2ee000;\n  box-shadow: 0 6px 24px rgba(57, 255, 20, 0.45);\n  transform: translateY(-2px);\n}\n.btn--primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n  transform: none;\n}\n.btn--outline[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1.5px solid rgba(57, 255, 20, 0.4);\n  color: #39ff14;\n  font-size: 0.82rem;\n  padding: 10px 20px;\n}\n.btn--outline[_ngcontent-%COMP%]:hover {\n  background: rgba(57, 255, 20, 0.08);\n  border-color: #39ff14;\n  box-shadow: 0 0 12px rgba(57, 255, 20, 0.15);\n}\n.btn--icon[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  font-size: 0.75rem;\n  border-radius: 50%;\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 700;\n}\n.btn--danger[_ngcontent-%COMP%] {\n  background: rgba(255, 59, 59, 0.1);\n  border: 1px solid rgba(255, 59, 59, 0.3);\n  color: #ff3b3b;\n}\n.btn--danger[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 59, 59, 0.2);\n  border-color: #ff3b3b;\n  box-shadow: 0 0 10px rgba(255, 59, 59, 0.2);\n}\n.btn--add[_ngcontent-%COMP%] {\n  margin-top: 4px;\n}\n.btn--sm[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  padding: 6px 14px;\n  text-decoration: none;\n}\n.btn--lg[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  padding: 14px 36px;\n}\n\n.link-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #39ff14;\n  cursor: pointer;\n  font-size: inherit;\n  text-decoration: underline;\n  padding: 0 4px;\n  font-family: \"Poppins\", sans-serif;\n}\n\n.spinner-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(11, 15, 12, 0.4);\n  border-top-color: #0b0f0c;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n\n.form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  padding: 8px 0 24px;\n}\n\n@media (max-width: 640px) {\n  .form-section[_ngcontent-%COMP%] {\n    padding: 20px 16px;\n  }\n  .admin-header[_ngcontent-%COMP%] {\n    padding: 24px 16px;\n  }\n  .admin-form[_ngcontent-%COMP%] {\n    padding: 16px 16px 0;\n  }\n  .admin-alerts[_ngcontent-%COMP%] {\n    padding: 12px 16px 0;\n  }\n  .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .form-row--toggles[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .form-group--two-thirds[_ngcontent-%COMP%] {\n    grid-column: span 1;\n  }\n  .form-actions[_ngcontent-%COMP%] {\n    justify-content: stretch;\n  }\n  .btn--primary[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYWRtaW4vcGFnZXMvY3JlYXRlLXByb2R1Y3QvY3JlYXRlLXByb2R1Y3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0JBQWdCO0FBdUJoQjtFQUNFLGlCQUFBO0VBQ0EsbUJBcEJRO0VBcUJSLGlCQUFBO0VBQ0Esa0NBUlU7QUFiWjs7QUF5QkE7RUFDRSw2REFBQTtFQUNBLGdEQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBdEJGO0FBd0JFO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLDZFQUFBO0VBQ0EseUJBQUE7RUFDQSxvQkFBQTtFQUNBLGFBQUE7QUF0Qko7QUF5QkU7RUFDRSxnQkFBQTtFQUNBLGNBQUE7QUF2Qko7QUEwQkU7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLGVBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7QUF4Qko7QUEyQkU7RUFDRSxpQ0EzQ1c7RUE0Q1gscUNBQUE7RUFDQSxnQkFBQTtFQUNBLGNBdkRHO0VBd0RILG1CQUFBO0VBQ0EseUJBQUE7RUFDQSwrRUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxrQkFBQTtBQXpCSjtBQTRCRTtFQUNFLGlCQUFBO0VBQ0Esb0RBQUE7QUExQko7QUE2QkU7RUFDRSxXQWpFSTtFQWtFSixpQkFBQTtFQUNBLHFCQUFBO0FBM0JKOztBQWdDQTtFQUNFLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLG9CQUFBO0FBN0JGOztBQWdDQTtFQUNFLGtCQUFBO0VBQ0Esa0JBL0VPO0VBZ0ZQLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtFQUNBLHNCQUFBO0VBQ0EsNkJBQUE7QUE3QkY7QUErQkU7RUFDRSxtQ0FBQTtFQUNBLDBCQS9GRztFQWdHSCxjQWhHRztFQWlHSCw0Q0FBQTtBQTdCSjtBQWdDRTtFQUNFLG1DQUFBO0VBQ0EsMEJBbEdFO0VB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O0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0FBMUVGOztBQTZFQTtFQUNFLHFCQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSx1Q0FBQTtFQUNBLHlCQWpqQlE7RUFrakJSLGtCQUFBO0VBQ0Esb0NBQUE7QUExRUY7O0FBOEVBO0VBQ0UsYUFBQTtFQUNBLHlCQUFBO0VBQ0EsbUJBQUE7QUEzRUY7O0FBK0VBO0VBQ0U7SUFBZ0Isa0JBQUE7RUEzRWhCO0VBNEVBO0lBQWlCLGtCQUFBO0VBekVqQjtFQTBFQTtJQUFpQixvQkFBQTtFQXZFakI7RUF3RUE7SUFBaUIsb0JBQUE7RUFyRWpCO0VBdUVBO0lBQ0UsMEJBQUE7RUFyRUY7RUF1RUU7SUFBYSw4QkFBQTtFQXBFZjtFQXVFQTtJQUEwQixtQkFBQTtFQXBFMUI7RUFxRUE7SUFBZ0Isd0JBQUE7RUFsRWhCO0VBbUVBO0lBQWdCLFdBQUE7RUFoRWhCO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDcmVhdGUtUHJvZHVjdCBBZG1pbiBQYWdlIMOiwoDClCBHVEEgTmVvbiBUaGVtZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgVmFyaWFibGVzIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuJGJnLXBhZ2U6ICMwYjBmMGM7XG4kYmctc2VjdGlvbjogIzBlMTgxMDtcbiRiZy1pdGVtOiAjMTExYzE0O1xuJGJnLWlucHV0OiAjMGIxMjA5O1xuJGJvcmRlcjogcmdiYSg1NywgMjU1LCAyMCwgMC4xNSk7XG4kYm9yZGVyLWZvY3VzOiAjMzlmZjE0O1xuJG5lb246ICMzOWZmMTQ7XG4kbmVvbi1kaW06IHJnYmEoNTcsIDI1NSwgMjAsIDAuMDgpO1xuJG5lb24tZ2xvdzogcmdiYSg1NywgMjU1LCAyMCwgMC4zNSk7XG4kb3JhbmdlOiAjZmY5OTAwO1xuJHJlZDogI2ZmM2IzYjtcbiR3aGl0ZTogI2Y1ZjVmNTtcbiRtdXRlZDogI2FhYTtcbiRyYWRpdXM6IDhweDtcbiRmb250LW1haW46ICdQb3BwaW5zJywgc2Fucy1zZXJpZjtcbiRmb250LWRpc3BsYXk6ICdPc3dhbGQnLCBzYW5zLXNlcmlmO1xuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgUGFnZSBMYXlvdXQgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYWRtaW4tcGFnZSB7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICBiYWNrZ3JvdW5kOiAkYmctcGFnZTtcbiAgcGFkZGluZzogMCAwIDgwcHg7XG4gIGZvbnQtZmFtaWx5OiAkZm9udC1tYWluO1xufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgSGVhZGVyIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmFkbWluLWhlYWRlciB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwZTE4MTAgMCUsICMxMTFjMTQgMTAwJSk7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAkYm9yZGVyO1xuICBwYWRkaW5nOiAzMnB4IDI0cHggMjhweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICY6OmFmdGVyIHtcbiAgICBjb250ZW50OiAnJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHJnYmEoMTgsIDE2LCAxNiwgMCkgNTAlLCByZ2JhKDAsIDAsIDAsIDAuMTgpIDUwJSk7XG4gICAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDRweDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBvcGFjaXR5OiAwLjI1O1xuICB9XG5cbiAgJl9faW5uZXIge1xuICAgIG1heC13aWR0aDogOTAwcHg7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gIH1cblxuICAmX190b3Atcm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBnYXA6IDEycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogNnB4O1xuICB9XG5cbiAgJl9fdGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwbGF5O1xuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS42cmVtLCA0dncsIDIuNHJlbSk7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJG5lb247XG4gICAgbGV0dGVyLXNwYWNpbmc6IDJweDtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIHRleHQtc2hhZG93OiAwIDAgMThweCAkbmVvbi1nbG93LCAwIDAgNDBweCByZ2JhKDU3LCAyNTUsIDIwLCAwLjE1KTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxMnB4O1xuICAgIG1hcmdpbi1ib3R0b206IDZweDtcbiAgfVxuXG4gICZfX2ljb24ge1xuICAgIGZvbnQtc2l6ZTogMS40cmVtO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCAwIDhweCAkbmVvbi1nbG93KTtcbiAgfVxuXG4gICZfX3N1YnRpdGxlIHtcbiAgICBjb2xvcjogJG11dGVkO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQWxlcnRzIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmFkbWluLWFsZXJ0cyB7XG4gIG1heC13aWR0aDogOTAwcHg7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwYWRkaW5nOiAxNnB4IDI0cHggMDtcbn1cblxuLmFsZXJ0IHtcbiAgcGFkZGluZzogMTRweCAxOHB4O1xuICBib3JkZXItcmFkaXVzOiAkcmFkaXVzO1xuICBmb250LXNpemU6IDAuOXJlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZDtcbiAgYW5pbWF0aW9uOiBmYWRlSW5VcCAwLjRzIGVhc2U7XG5cbiAgJi0tc3VjY2VzcyB7XG4gICAgYmFja2dyb3VuZDogcmdiYSg1NywgMjU1LCAyMCwgMC4wNik7XG4gICAgYm9yZGVyLWxlZnQtY29sb3I6ICRuZW9uO1xuICAgIGNvbG9yOiAkbmVvbjtcbiAgICBib3gtc2hhZG93OiAwIDAgMTJweCByZ2JhKDU3LCAyNTUsIDIwLCAwLjA4KTtcbiAgfVxuXG4gICYtLWVycm9yIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgNTksIDU5LCAwLjA2KTtcbiAgICBib3JkZXItbGVmdC1jb2xvcjogJHJlZDtcbiAgICBjb2xvcjogJHJlZDtcbiAgICBib3gtc2hhZG93OiAwIDAgMTJweCByZ2JhKDI1NSwgNTksIDU5LCAwLjA4KTtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRm9ybSBDb250YWluZXIgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYWRtaW4tZm9ybSB7XG4gIG1heC13aWR0aDogOTAwcHg7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwYWRkaW5nOiAyNHB4IDI0cHggMDtcbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIFNlY3Rpb25zIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmZvcm0tc2VjdGlvbiB7XG4gIGJhY2tncm91bmQ6ICRiZy1zZWN0aW9uO1xuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBwYWRkaW5nOiAyOHB4O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjNzO1xuXG4gICY6aG92ZXIge1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSg1NywgMjU1LCAyMCwgMC4zKTtcbiAgfVxuXG4gICZfX3RpdGxlIHtcbiAgICBmb250LWZhbWlseTogJGZvbnQtZGlzcGxheTtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IDNweDtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTBweDtcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICB9XG5cbiAgJl9fbnVtIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAyOHB4O1xuICAgIGhlaWdodDogMjhweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYmFja2dyb3VuZDogJG5lb24tZGltO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICRib3JkZXItZm9jdXM7XG4gICAgY29sb3I6ICRuZW9uO1xuICAgIGZvbnQtc2l6ZTogMC43cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgYm94LXNoYWRvdzogMCAwIDhweCByZ2JhKDU3LCAyNTUsIDIwLCAwLjE4KTtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRm9ybSBSb3dzIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmZvcm0tcm93IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICBnYXA6IDE2cHg7XG4gIG1hcmdpbi1ib3R0b206IDA7XG5cbiAgJi0tdG9nZ2xlcyB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMTYwcHgsIDFmcikpO1xuICAgIG1hcmdpbi10b3A6IDhweDtcbiAgfVxufVxuXG4uZm9ybS1ncm91cCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogNnB4O1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuXG4gICYtLWhhbGYgICAgIHsgLyogYWxyZWFkeSBpbiBncmlkIMOiwoDClCBmdWxsICovIH1cbiAgJi0tdHdvLXRoaXJkcyB7IGdyaWQtY29sdW1uOiBzcGFuIDI7IH1cbiAgJi0tb25lLXRoaXJkICB7IC8qIHNpbmdsZSBjZWxsICovIH1cblxuICAmLS1jZW50ZXIge1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICB9XG5cbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XG4gICAgJi0tdHdvLXRoaXJkcyB7IGdyaWQtY29sdW1uOiBzcGFuIDE7IH1cbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgTGFiZWxzIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmZvcm0tbGFiZWwge1xuICBmb250LXNpemU6IDAuOHJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICRtdXRlZDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbn1cblxuLnJlcXVpcmVkIHtcbiAgY29sb3I6ICRuZW9uO1xuICBtYXJnaW4tbGVmdDogMnB4O1xufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgSW5wdXRzIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmZvcm0taW5wdXQge1xuICBiYWNrZ3JvdW5kOiAkYmctaW5wdXQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoNTcsIDI1NSwgMjAsIDAuMik7XG4gIGJvcmRlci1yYWRpdXM6ICRyYWRpdXM7XG4gIGNvbG9yOiAkd2hpdGU7XG4gIGZvbnQtZmFtaWx5OiAkZm9udC1tYWluO1xuICBmb250LXNpemU6IDAuOTJyZW07XG4gIHBhZGRpbmc6IDExcHggMTRweDtcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMjVzLCBib3gtc2hhZG93IDAuMjVzO1xuICB3aWR0aDogMTAwJTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYXBwZWFyYW5jZTogbm9uZTtcblxuICAmOjpwbGFjZWhvbGRlciB7IGNvbG9yOiAjNTU1OyB9XG5cbiAgJjpmb2N1cyB7XG4gICAgYm9yZGVyLWNvbG9yOiAkYm9yZGVyLWZvY3VzO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDU3LCAyNTUsIDIwLCAwLjEyKSwgMCAwIDEycHggcmdiYSg1NywgMjU1LCAyMCwgMC4wOCk7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxuXG4gICYtLWVycm9yIHtcbiAgICBib3JkZXItY29sb3I6ICRyZWQgIWltcG9ydGFudDtcbiAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgyNTUsIDU5LCA1OSwgMC4xMikgIWltcG9ydGFudDtcbiAgfVxuXG4gICYtLXRleHRhcmVhIHtcbiAgICByZXNpemU6IHZlcnRpY2FsO1xuICAgIG1pbi1oZWlnaHQ6IDEwMHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjY7XG4gIH1cblxuICAmLS1zZWxlY3Qge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgIG9wdGlvbiB7XG4gICAgICBiYWNrZ3JvdW5kOiAjMTExO1xuICAgICAgY29sb3I6ICR3aGl0ZTtcbiAgICB9XG4gIH1cbn1cblxuLy8gTnVtYmVyIGlucHV0IGFycm93c1xuaW5wdXRbdHlwZT0nbnVtYmVyJ106Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5pbnB1dFt0eXBlPSdudW1iZXInXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIG9wYWNpdHk6IDAuNTtcbiAgZmlsdGVyOiBpbnZlcnQoMSk7XG59XG5cbi8vIFNlbGVjdCB3cmFwcGVyIGZvciBjdXN0b20gYXJyb3dcbi5zZWxlY3Qtd3JhcHBlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmOjphZnRlciB7XG4gICAgY29udGVudDogJ8OiwpbCvic7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAxNHB4O1xuICAgIHRvcDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgICBjb2xvcjogJG5lb247XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgZm9udC1zaXplOiAwLjg1cmVtO1xuICB9XG5cbiAgLmZvcm0taW5wdXQtLXNlbGVjdCB7XG4gICAgcGFkZGluZy1yaWdodDogMzZweDtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRXJyb3IgTWVzc2FnZXMgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uZm9ybS1lcnJvciB7XG4gIGZvbnQtc2l6ZTogMC43NnJlbTtcbiAgY29sb3I6ICRyZWQ7XG4gIG1hcmdpbi10b3A6IC0ycHg7XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBUb2dnbGUgU3dpdGNoIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLnRvZ2dsZS1sYWJlbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYmFja2dyb3VuZDogJGJnLWl0ZW07XG4gIGJvcmRlcjogMXB4IHNvbGlkICRib3JkZXI7XG4gIGJvcmRlci1yYWRpdXM6ICRyYWRpdXM7XG4gIHBhZGRpbmc6IDEycHggMTRweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgZ2FwOiAxMnB4O1xuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4yNXM7XG5cbiAgJjpob3ZlciB7IGJvcmRlci1jb2xvcjogcmdiYSg1NywgMjU1LCAyMCwgMC4zNSk7IH1cblxuICAmX190ZXh0IHtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBjb2xvcjogJHdoaXRlO1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgfVxufVxuXG4udG9nZ2xlLXN3aXRjaCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB3aWR0aDogNDRweDtcbiAgaGVpZ2h0OiAyNHB4O1xuICBmbGV4LXNocmluazogMDtcblxuICAmX19pbnB1dCB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB3aWR0aDogMDtcbiAgICBoZWlnaHQ6IDA7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgJjpjaGVja2VkICsgLnRvZ2dsZS1zd2l0Y2hfX3NsaWRlciB7XG4gICAgICBiYWNrZ3JvdW5kOiAkbmVvbjtcbiAgICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICRuZW9uLWdsb3c7XG5cbiAgICAgICY6OmJlZm9yZSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyMHB4KTtcbiAgICAgICAgYmFja2dyb3VuZDogJGJnLXBhZ2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJl9fc2xpZGVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgYmFja2dyb3VuZDogIzFhMmExYTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDI0cHg7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjI1cztcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAmOjpiZWZvcmUge1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB3aWR0aDogMThweDtcbiAgICAgIGhlaWdodDogMThweDtcbiAgICAgIGxlZnQ6IDNweDtcbiAgICAgIHRvcDogNTAlO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICAgICAgYmFja2dyb3VuZDogJG11dGVkO1xuICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMjVzO1xuICAgIH1cbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQ2hlY2tib3ggw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uY2hlY2tib3gtbGFiZWwge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEwcHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgbWFyZ2luLXRvcDogMjRweDtcbn1cblxuLmNoZWNrYm94LWlucHV0IHtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbiAgd2lkdGg6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjQpO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJhY2tncm91bmQ6ICRiZy1pbnB1dDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmbGV4LXNocmluazogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMnMsIGJvcmRlci1jb2xvciAwLjJzO1xuXG4gICY6Y2hlY2tlZCB7XG4gICAgYmFja2dyb3VuZDogJG5lb247XG4gICAgYm9yZGVyLWNvbG9yOiAkbmVvbjtcblxuICAgICY6OmFmdGVyIHtcbiAgICAgIGNvbnRlbnQ6ICfDosKcwpMnO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiA1MCU7XG4gICAgICBsZWZ0OiA1MCU7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICBjb2xvcjogJGJnLXBhZ2U7XG4gICAgfVxuICB9XG59XG5cbi5jaGVja2JveC10ZXh0IHtcbiAgZm9udC1zaXplOiAwLjg1cmVtO1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogJHdoaXRlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBsZXR0ZXItc3BhY2luZzogMXB4O1xufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRHluYW1pYyBMaXN0cyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5keW5hbWljLWxpc3Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDEycHg7XG4gIG1hcmdpbi1ib3R0b206IDE0cHg7XG59XG5cbi5keW5hbWljLWl0ZW0ge1xuICBiYWNrZ3JvdW5kOiAkYmctaXRlbTtcbiAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlcjtcbiAgYm9yZGVyLXJhZGl1czogJHJhZGl1cztcbiAgcGFkZGluZzogMjBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBhbmltYXRpb246IGZhZGVJblVwIDAuM3MgZWFzZTtcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMjVzO1xuXG4gICY6aG92ZXIge1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSg1NywgMjU1LCAyMCwgMC4zKTtcbiAgfVxuXG4gICZfX2hlYWRlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICB9XG5cbiAgJl9fYmFkZ2Uge1xuICAgIGZvbnQtc2l6ZTogMC43MnJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGxldHRlci1zcGFjaW5nOiAycHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBjb2xvcjogJG5lb247XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3BsYXk7XG4gIH1cbn1cblxuLmVtcHR5LXN0YXRlIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzU1NTtcbiAgZm9udC1zaXplOiAwLjg4cmVtO1xuICBwYWRkaW5nOiAyMHB4IDAgMTJweDtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQnV0dG9ucyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5idG4ge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogOHB4O1xuICBmb250LWZhbWlseTogJGZvbnQtZGlzcGxheTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDEuNXB4O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBib3JkZXI6IG5vbmU7XG4gIGJvcmRlci1yYWRpdXM6ICRyYWRpdXM7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMjVzIGVhc2U7XG5cbiAgJi0tcHJpbWFyeSB7XG4gICAgYmFja2dyb3VuZDogJG5lb247XG4gICAgY29sb3I6ICRiZy1wYWdlO1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICBwYWRkaW5nOiAxNHB4IDM2cHg7XG5cbiAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgIGJhY2tncm91bmQ6ICMyZWUwMDA7XG4gICAgICBib3gtc2hhZG93OiAwIDZweCAyNHB4IHJnYmEoNTcsIDI1NSwgMjAsIDAuNDUpO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICAgIH1cblxuICAgICY6ZGlzYWJsZWQge1xuICAgICAgb3BhY2l0eTogMC41NTtcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICB0cmFuc2Zvcm06IG5vbmU7XG4gICAgfVxuICB9XG5cbiAgJi0tb3V0bGluZSB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyOiAxLjVweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjQpO1xuICAgIGNvbG9yOiAkbmVvbjtcbiAgICBmb250LXNpemU6IDAuODJyZW07XG4gICAgcGFkZGluZzogMTBweCAyMHB4O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjA4KTtcbiAgICAgIGJvcmRlci1jb2xvcjogJG5lb247XG4gICAgICBib3gtc2hhZG93OiAwIDAgMTJweCByZ2JhKDU3LCAyNTUsIDIwLCAwLjE1KTtcbiAgICB9XG4gIH1cblxuICAmLS1pY29uIHtcbiAgICB3aWR0aDogMzBweDtcbiAgICBoZWlnaHQ6IDMwcHg7XG4gICAgcGFkZGluZzogMDtcbiAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1tYWluO1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIH1cblxuICAmLS1kYW5nZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCA1OSwgNTksIDAuMSk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDU5LCA1OSwgMC4zKTtcbiAgICBjb2xvcjogJHJlZDtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDU5LCA1OSwgMC4yKTtcbiAgICAgIGJvcmRlci1jb2xvcjogJHJlZDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4IHJnYmEoMjU1LCA1OSwgNTksIDAuMik7XG4gICAgfVxuICB9XG5cbiAgJi0tYWRkIHtcbiAgICBtYXJnaW4tdG9wOiA0cHg7XG4gIH1cblxuICAmLS1zbSB7XG4gICAgZm9udC1zaXplOiAwLjc1cmVtO1xuICAgIHBhZGRpbmc6IDZweCAxNHB4O1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgfVxuXG4gICYtLWxnIHtcbiAgICBmb250LXNpemU6IDFyZW07XG4gICAgcGFkZGluZzogMTRweCAzNnB4O1xuICB9XG59XG5cbi5saW5rLWJ0biB7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgY29sb3I6ICRuZW9uO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gIHBhZGRpbmc6IDAgNHB4O1xuICBmb250LWZhbWlseTogJGZvbnQtbWFpbjtcbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIFNwaW5uZXIgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uc3Bpbm5lci10ZXh0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiA4cHg7XG59XG5cbi5zcGlubmVyIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB3aWR0aDogMTZweDtcbiAgaGVpZ2h0OiAxNnB4O1xuICBib3JkZXI6IDJweCBzb2xpZCByZ2JhKDExLCAxNSwgMTIsIDAuNCk7XG4gIGJvcmRlci10b3AtY29sb3I6ICRiZy1wYWdlO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogc3BpbiAwLjdzIGxpbmVhciBpbmZpbml0ZTtcbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIEZvcm0gQWN0aW9ucyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5mb3JtLWFjdGlvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBwYWRkaW5nOiA4cHggMCAyNHB4O1xufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgUmVzcG9uc2l2ZSDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xuICAuZm9ybS1zZWN0aW9uIHsgcGFkZGluZzogMjBweCAxNnB4OyB9XG4gIC5hZG1pbi1oZWFkZXIgIHsgcGFkZGluZzogMjRweCAxNnB4OyB9XG4gIC5hZG1pbi1mb3JtICAgIHsgcGFkZGluZzogMTZweCAxNnB4IDA7IH1cbiAgLmFkbWluLWFsZXJ0cyAgeyBwYWRkaW5nOiAxMnB4IDE2cHggMDsgfVxuXG4gIC5mb3JtLXJvdyB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG5cbiAgICAmLS10b2dnbGVzIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyOyB9XG4gIH1cblxuICAuZm9ybS1ncm91cC0tdHdvLXRoaXJkcyB7IGdyaWQtY29sdW1uOiBzcGFuIDE7IH1cbiAgLmZvcm0tYWN0aW9ucyB7IGp1c3RpZnktY29udGVudDogc3RyZXRjaDsgfVxuICAuYnRuLS1wcmltYXJ5IHsgd2lkdGg6IDEwMCU7IH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 2621:
/*!********************************************************************************************!*\
  !*** ./src/app/admin/pages/edit-product-placeholder/edit-product-placeholder.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditProductPlaceholderComponent: () => (/* binding */ EditProductPlaceholderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 5072);


class EditProductPlaceholderComponent {
  constructor(route) {
    this.route = route;
    this.productId = '';
  }
  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
  }
  static {
    this.ɵfac = function EditProductPlaceholderComponent_Factory(t) {
      return new (t || EditProductPlaceholderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.ActivatedRoute));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: EditProductPlaceholderComponent,
      selectors: [["app-edit-product-placeholder"]],
      decls: 19,
      vars: 1,
      consts: [[1, "edit-placeholder-container"], [1, "placeholder-card"], [1, "breadcrumb"], ["routerLink", "/admin/products", 1, "back-link"], [1, "icon-wrap"], [1, "title"], [1, "subtitle"], [1, "id-tag"], [1, "info-box"], [1, "actions"], ["routerLink", "/admin/products", 1, "btn", "btn--primary"]],
      template: function EditProductPlaceholderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "\u2190 Back to Products");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "\uD83D\uDEE0\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h1", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Edit Product");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " Editing product ID: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "code", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 8)(14, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " The dedicated full-page product editor is scheduled for the upcoming development milestone. This route has been configured to preserve navigation integrity. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 9)(17, "a", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " Return to Product List ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.productId);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink],
      styles: [".edit-placeholder-container[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: calc(100vh - 120px);\n  font-family: \"Poppins\", sans-serif;\n}\n\n.placeholder-card[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(57, 255, 20, 0.2);\n  border-radius: 12px;\n  padding: 36px 32px;\n  max-width: 580px;\n  width: 100%;\n  text-align: center;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n}\n\n.breadcrumb[_ngcontent-%COMP%] {\n  text-align: left;\n  margin-bottom: 24px;\n}\n\n.back-link[_ngcontent-%COMP%] {\n  color: #39ff14;\n  text-decoration: none;\n  font-size: 0.88rem;\n  font-weight: 500;\n  transition: opacity 0.2s;\n}\n.back-link[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n}\n\n.icon-wrap[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 12px;\n}\n\n.title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 1.8rem;\n  color: #39ff14;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  margin-bottom: 8px;\n}\n\n.subtitle[_ngcontent-%COMP%] {\n  color: #aaa;\n  font-size: 0.9rem;\n  margin-bottom: 24px;\n}\n\n.id-tag[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.1);\n  border: 1px solid rgba(57, 255, 20, 0.3);\n  color: #39ff14;\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 0.85rem;\n  word-break: break-all;\n}\n\n.info-box[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px dashed rgba(57, 255, 20, 0.2);\n  border-radius: 8px;\n  padding: 16px;\n  margin-bottom: 28px;\n  color: #ccc;\n  font-size: 0.88rem;\n  line-height: 1.5;\n}\n\n.btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 10px 22px;\n  border-radius: 6px;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.95rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  font-weight: 600;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #39ff14;\n  color: #0b0f0c;\n  box-shadow: 0 0 16px rgba(57, 255, 20, 0.35);\n}\n.btn--primary[_ngcontent-%COMP%]:hover {\n  background: #4eff2e;\n  box-shadow: 0 0 24px rgba(57, 255, 20, 0.55);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYWRtaW4vcGFnZXMvZWRpdC1wcm9kdWN0LXBsYWNlaG9sZGVyL2VkaXQtcHJvZHVjdC1wbGFjZWhvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0k7RUFDRSxrQkFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsK0JBQUE7RUFDQSxrQ0FBQTtBQUFOOztBQUVJO0VBQ0UsbUJBQUE7RUFDQSx3Q0FBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLHlDQUFBO0FBQ047O0FBQ0k7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBRU47O0FBQUk7RUFDRSxjQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esd0JBQUE7QUFHTjtBQUZNO0VBQVUsWUFBQTtBQUtoQjs7QUFISTtFQUNFLGVBQUE7RUFDQSxtQkFBQTtBQU1OOztBQUpJO0VBQ0UsaUNBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7RUFDQSx5QkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7QUFPTjs7QUFMSTtFQUNFLFdBQUE7RUFDQSxpQkFBQTtFQUNBLG1CQUFBO0FBUU47O0FBTkk7RUFDRSxrQ0FBQTtFQUNBLHdDQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLHFCQUFBO0FBU047O0FBUEk7RUFDRSxxQ0FBQTtFQUNBLHlDQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQVVOOztBQVJJO0VBQ0Usb0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGlDQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtBQVdOO0FBVk07RUFDRSxtQkFBQTtFQUNBLGNBQUE7RUFDQSw0Q0FBQTtBQVlSO0FBWFE7RUFDRSxtQkFBQTtFQUNBLDRDQUFBO0FBYVYiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAuZWRpdC1wbGFjZWhvbGRlci1jb250YWluZXIge1xuICAgICAgcGFkZGluZzogNDBweCAyMHB4O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoMTAwdmggLSAxMjBweCk7XG4gICAgICBmb250LWZhbWlseTogJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuICAgIH1cbiAgICAucGxhY2Vob2xkZXItY2FyZCB7XG4gICAgICBiYWNrZ3JvdW5kOiAjMGUxODEwO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSg1NywgMjU1LCAyMCwgMC4yKTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICBwYWRkaW5nOiAzNnB4IDMycHg7XG4gICAgICBtYXgtd2lkdGg6IDU4MHB4O1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBib3gtc2hhZG93OiAwIDhweCAzMnB4IHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICB9XG4gICAgLmJyZWFkY3J1bWIge1xuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gICAgfVxuICAgIC5iYWNrLWxpbmsge1xuICAgICAgY29sb3I6ICMzOWZmMTQ7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICBmb250LXNpemU6IDAuODhyZW07XG4gICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzO1xuICAgICAgJjpob3ZlciB7IG9wYWNpdHk6IDAuODsgfVxuICAgIH1cbiAgICAuaWNvbi13cmFwIHtcbiAgICAgIGZvbnQtc2l6ZTogM3JlbTtcbiAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XG4gICAgfVxuICAgIC50aXRsZSB7XG4gICAgICBmb250LWZhbWlseTogJ09zd2FsZCcsIHNhbnMtc2VyaWY7XG4gICAgICBmb250LXNpemU6IDEuOHJlbTtcbiAgICAgIGNvbG9yOiAjMzlmZjE0O1xuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgIGxldHRlci1zcGFjaW5nOiAycHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gICAgfVxuICAgIC5zdWJ0aXRsZSB7XG4gICAgICBjb2xvcjogI2FhYTtcbiAgICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgICB9XG4gICAgLmlkLXRhZyB7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjEpO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSg1NywgMjU1LCAyMCwgMC4zKTtcbiAgICAgIGNvbG9yOiAjMzlmZjE0O1xuICAgICAgcGFkZGluZzogMnB4IDhweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgICB9XG4gICAgLmluZm8tYm94IHtcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMyk7XG4gICAgICBib3JkZXI6IDFweCBkYXNoZWQgcmdiYSg1NywgMjU1LCAyMCwgMC4yKTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgIHBhZGRpbmc6IDE2cHg7XG4gICAgICBtYXJnaW4tYm90dG9tOiAyOHB4O1xuICAgICAgY29sb3I6ICNjY2M7XG4gICAgICBmb250LXNpemU6IDAuODhyZW07XG4gICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIH1cbiAgICAuYnRuIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgcGFkZGluZzogMTBweCAyMnB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgZm9udC1mYW1pbHk6ICdPc3dhbGQnLCBzYW5zLXNlcmlmO1xuICAgICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XG4gICAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZDogIzM5ZmYxNDtcbiAgICAgICAgY29sb3I6ICMwYjBmMGM7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMCAxNnB4IHJnYmEoNTcsIDI1NSwgMjAsIDAuMzUpO1xuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaWdodGVuKCMzOWZmMTQsIDUlKTtcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMjRweCByZ2JhKDU3LCAyNTUsIDIwLCAwLjU1KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 6629:
/*!************************************************************!*\
  !*** ./src/app/admin/pages/products/products.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProductsComponent: () => (/* binding */ ProductsComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 2575);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 1817);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_admin_product_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/admin-product.service */ 971);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);







function ProductsComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"](" ", ctx_r0.totalProducts, " ", ctx_r0.totalProducts === 1 ? "product" : "products", " ");
  }
}
function ProductsComponent_div_19_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 38)(1, "div", 39)(2, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "\u2713");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_19_div_1_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r11.dismissSuccessMessage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r9.successMessage);
  }
}
function ProductsComponent_div_19_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 42)(1, "div", 39)(2, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "\u26A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_19_div_2_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r13.dismissErrorMessage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "\u2715");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r10.errorMessage);
  }
}
function ProductsComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, ProductsComponent_div_19_div_1_Template, 8, 1, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, ProductsComponent_div_19_div_2_Template, 8, 1, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.successMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.errorMessage);
  }
}
function ProductsComponent_button_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_button_25_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r15.clearSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " \u2715 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_option_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const cat_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", cat_r17.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", cat_r17.name, " ");
  }
}
function ProductsComponent_button_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_button_50_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r18.resetAllFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Clear Filters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 46)(1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\u26A0\uFE0F");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h2", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Unable to load products.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_51_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r21);
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r20.retryLoad());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, " Retry ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r5.errorMessage);
  }
}
function ProductsComponent_div_52_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "div", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "div", 60)(4, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "div", 62)(6, "div", 63)(7, "div", 64)(8, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
const _c0 = function () {
  return [1, 2, 3, 4, 5];
};
function ProductsComponent_div_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 51)(1, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Loading products...");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, ProductsComponent_div_52_div_6_Template, 9, 0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](1, _c0));
  }
}
function ProductsComponent_div_53_div_1_tr_17_img_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "img", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("error", function ProductsComponent_div_53_div_1_tr_17_img_4_Template_img_error_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r36);
      const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r35.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r30.getProductPrimaryImage(product_r29), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"])("alt", product_r29.name);
  }
}
function ProductsComponent_div_53_div_1_tr_17_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 108)(1, "span", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\uD83D\uDCE6");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function ProductsComponent_div_53_div_1_tr_17_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 110)(1, "span", 111);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Material:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", product_r29.material, " ");
  }
}
function ProductsComponent_div_53_div_1_tr_17_del_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "del", 112);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" $", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](2, 1, product_r29.compare_price, "1.2-2"), " ");
  }
}
function ProductsComponent_div_53_div_1_tr_17_span_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " \u2605 Featured ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_div_53_div_1_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "tr", 80)(1, "td", 81)(2, "div", 82)(3, "div", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ProductsComponent_div_53_div_1_tr_17_img_4_Template, 1, 2, "img", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, ProductsComponent_div_53_div_1_tr_17_div_5_Template, 3, 0, "div", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 86)(7, "div", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, ProductsComponent_div_53_div_1_tr_17_div_11_Template, 4, 1, "div", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "td", 90)(13, "span", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "td", 92)(16, "div", 93)(17, "span", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](19, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](20, ProductsComponent_div_53_div_1_tr_17_del_20_Template, 3, 4, "del", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "td", 96)(22, "span", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "td", 98)(25, "div", 99)(26, "span", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](28, ProductsComponent_div_53_div_1_tr_17_span_28_Template, 2, 0, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "td", 102)(30, "div", 103)(31, "button", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_div_1_tr_17_Template_button_click_31_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const product_r29 = restoredCtx.$implicit;
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r40.navigateToEdit(product_r29.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, " Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "span", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "|");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "button", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_div_1_tr_17_Template_button_click_35_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r41);
      const product_r29 = restoredCtx.$implicit;
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r42.openDeleteConfirm(product_r29));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, " Delete ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const product_r29 = ctx.$implicit;
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r28.getProductPrimaryImage(product_r29));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r28.getProductPrimaryImage(product_r29));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("title", product_r29.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](product_r29.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("/", product_r29.slug, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", product_r29.material);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r28.getCategoryLabel(product_r29), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("$", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](19, 20, product_r29.price, "1.2-2"), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", product_r29.compare_price);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("stock-value--zero", ctx_r28.isOutOfStock(product_r29))("stock-value--none", ctx_r28.getTotalStock(product_r29) === "\u2014");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r28.getTotalStock(product_r29), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("badge--active", product_r29.is_active)("badge--inactive", !product_r29.is_active);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", product_r29.is_active ? "Active" : "Inactive", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", product_r29.is_featured);
  }
}
function ProductsComponent_div_53_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 71)(1, "table", 72)(2, "thead")(3, "tr")(4, "th", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Product");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "th", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "th", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Price");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "th", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Stock");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "th", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "th", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, ProductsComponent_div_53_div_1_tr_17_Template, 37, 23, "tr", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r24.products);
  }
}
function ProductsComponent_div_53_div_2_article_1_img_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "img", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("error", function ProductsComponent_div_53_div_2_article_1_img_3_Template_img_error_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r50.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r45.getProductPrimaryImage(product_r44), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"])("alt", product_r44.name);
  }
}
function ProductsComponent_div_53_div_2_article_1_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 108)(1, "span", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\uD83D\uDCE6");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function ProductsComponent_div_53_div_2_article_1_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " \u2605 Featured ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_div_53_div_2_article_1_del_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "del", 112);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" $", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](2, 1, product_r44.compare_price, "1.2-2"), " ");
  }
}
function ProductsComponent_div_53_div_2_article_1_div_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 122)(1, "span", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Material");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 128);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const product_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](product_r44.material);
  }
}
function ProductsComponent_div_53_div_2_article_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "article", 116)(1, "div", 117)(2, "div", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, ProductsComponent_div_53_div_2_article_1_img_3_Template, 1, 2, "img", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ProductsComponent_div_53_div_2_article_1_div_4_Template, 3, 0, "div", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 118)(6, "h3", 119);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "span", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 120)(11, "span", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, ProductsComponent_div_53_div_2_article_1_span_13_Template, 2, 0, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 121)(15, "div", 122)(16, "span", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "span", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 122)(21, "span", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Price");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "div", 93)(24, "span", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](26, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](27, ProductsComponent_div_53_div_2_article_1_del_27_Template, 3, 4, "del", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 122)(29, "span", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "Stock");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "span", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](33, ProductsComponent_div_53_div_2_article_1_div_33_Template, 5, 1, "div", 124);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 125)(35, "button", 126);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_div_2_article_1_Template_button_click_35_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r56);
      const product_r44 = restoredCtx.$implicit;
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r55.navigateToEdit(product_r44.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, " \u270F\uFE0F Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "button", 127);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_div_2_article_1_Template_button_click_37_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r56);
      const product_r44 = restoredCtx.$implicit;
      const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r57.openDeleteConfirm(product_r44));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, " \uD83D\uDDD1\uFE0F Delete ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const product_r44 = ctx.$implicit;
    const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r43.getProductPrimaryImage(product_r44));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r43.getProductPrimaryImage(product_r44));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](product_r44.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("/", product_r44.slug, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("badge--active", product_r44.is_active)("badge--inactive", !product_r44.is_active);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", product_r44.is_active ? "Active" : "Inactive", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", product_r44.is_featured);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r43.getCategoryLabel(product_r44));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("$", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](26, 19, product_r44.price, "1.2-2"), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", product_r44.compare_price);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("stock-value--zero", ctx_r43.isOutOfStock(product_r44))("stock-value--none", ctx_r43.getTotalStock(product_r44) === "\u2014");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r43.getTotalStock(product_r44), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", product_r44.material);
  }
}
function ProductsComponent_div_53_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, ProductsComponent_div_53_div_2_article_1_Template, 39, 22, "article", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r25.products);
  }
}
function ProductsComponent_div_53_div_3_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r60 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_div_3_button_10_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r60);
      const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r59.resetAllFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Reset Filters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_div_53_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 129)(1, "div", 130);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\uD83D\uDCE6");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h2", 131);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "No products found.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p", 132);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Try changing your filters or create your first product.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 133)(8, "a", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " + Add Product ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, ProductsComponent_div_53_div_3_button_10_Template, 2, 0, "button", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r26.isFiltered);
  }
}
function ProductsComponent_div_53_footer_4_nav_3_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r65 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 144);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_footer_4_nav_3_button_4_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r65);
      const pageNum_r63 = restoredCtx.$implicit;
      const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r64.changePage(pageNum_r63));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const pageNum_r63 = ctx.$implicit;
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("is-active", pageNum_r63 === ctx_r62.currentPage);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r62.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", pageNum_r63, " ");
  }
}
function ProductsComponent_div_53_footer_4_nav_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r67 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "nav", 139)(1, "button", 140);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_footer_4_nav_3_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r67);
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r66.previousPage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " < Previous ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 141);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ProductsComponent_div_53_footer_4_nav_3_button_4_Template, 2, 4, "button", 142);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "button", 143);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_53_footer_4_nav_3_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r67);
      const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r68.nextPage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " Next > ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r61.currentPage === 1 || ctx_r61.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r61.pagesArray);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r61.currentPage === ctx_r61.totalPages || ctx_r61.isLoading);
  }
}
function ProductsComponent_div_53_footer_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "footer", 136)(1, "div", 137);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, ProductsComponent_div_53_footer_4_nav_3_Template, 7, 3, "nav", 138);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate3"](" Showing ", ctx_r27.rangeStart, "\u2013", ctx_r27.rangeEnd, " of ", ctx_r27.totalProducts, " products ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r27.totalPages > 1);
  }
}
function ProductsComponent_div_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, ProductsComponent_div_53_div_1_Template, 18, 1, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, ProductsComponent_div_53_div_2_Template, 2, 1, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, ProductsComponent_div_53_div_3_Template, 11, 1, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ProductsComponent_div_53_footer_4_Template, 4, 4, "footer", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r7.products.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r7.products.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r7.products.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r7.products.length > 0 && ctx_r7.totalPages > 0);
  }
}
function ProductsComponent_div_54_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 161);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r69.deleteError, " ");
  }
}
function ProductsComponent_div_54_span_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Yes, Delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_div_54_span_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 162);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 163);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " Deleting... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ProductsComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r73 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 145);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_54_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r73);
      const ctx_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r72.closeDeleteConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 146);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_54_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "header", 147)(3, "h2", 148);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, " Delete Product ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "button", 149);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_54_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r73);
      const ctx_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r75.closeDeleteConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " \u2715 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 150)(8, "div", 151);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "\u26A0\uFE0F");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "p", 152);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, " Are you sure you want to delete this product? ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "p", 153);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "p", 154);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, " This operation will delete this product, all its variants, and gallery images. This action cannot be reversed. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](16, ProductsComponent_div_54_div_16_Template, 2, 1, "div", 155);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "footer", 156)(18, "button", 157);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_54_Template_button_click_18_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r73);
      const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r76.closeDeleteConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Cancel ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "button", 158);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_div_54_Template_button_click_20_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r73);
      const ctx_r77 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r77.confirmDelete());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](21, ProductsComponent_div_54_span_21_Template, 2, 0, "span", 159);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](22, ProductsComponent_div_54_span_22_Template, 3, 0, "span", 160);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r8.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" \"", ctx_r8.productToDelete.name, "\" ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r8.deleteError);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r8.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r8.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r8.isDeleting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r8.isDeleting);
  }
}
class ProductsComponent {
  constructor(adminProductService, router) {
    this.adminProductService = adminProductService;
    this.router = router;
    // Data state
    this.products = [];
    this.categories = [];
    // Loading & Error states
    this.isLoading = false;
    this.isCategoriesLoading = false;
    this.errorMessage = null;
    this.successMessage = null;
    // Search & Filter state
    this.searchTerm = '';
    this.selectedCategoryId = '';
    this.selectedFeatured = 'all';
    // Pagination state (server-driven)
    this.currentPage = 1;
    this.pageSize = 20;
    this.totalProducts = 0;
    this.totalPages = 0;
    // Delete modal state
    this.productToDelete = null;
    this.isDeleting = false;
    this.deleteError = null;
    // RxJS
    this.searchSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  }
  ngOnInit() {
    this.setupSearchDebounce();
    this.loadCategories();
    this.loadProducts();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // ─── Setup Search Debounce (300ms) ───────────────────────────
  setupSearchDebounce() {
    this.searchSubject.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.debounceTime)(300), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.distinctUntilChanged)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1;
      this.loadProducts();
    });
  }
  onSearchInput(event) {
    const input = event.target;
    this.searchSubject.next(input.value);
  }
  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadProducts();
  }
  // ─── Filter Handlers ─────────────────────────────────────────
  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }
  onFeaturedChange() {
    this.currentPage = 1;
    this.loadProducts();
  }
  resetAllFilters() {
    this.searchTerm = '';
    this.selectedCategoryId = '';
    this.selectedFeatured = 'all';
    this.currentPage = 1;
    this.loadProducts();
  }
  get isFiltered() {
    return this.searchTerm.trim() !== '' || this.selectedCategoryId !== '' || this.selectedFeatured !== 'all';
  }
  // ─── Data Loading ────────────────────────────────────────────
  loadCategories() {
    this.isCategoriesLoading = true;
    this.adminProductService.getCategories().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: cats => {
        this.categories = cats;
        this.isCategoriesLoading = false;
      },
      error: () => {
        this.isCategoriesLoading = false;
      }
    });
  }
  loadProducts() {
    this.isLoading = true;
    this.errorMessage = null;
    let isFeaturedParam = null;
    if (this.selectedFeatured === 'featured') {
      isFeaturedParam = true;
    } else if (this.selectedFeatured === 'not_featured') {
      isFeaturedParam = false;
    }
    this.adminProductService.getProducts({
      page: this.currentPage,
      pageSize: this.pageSize,
      categoryId: this.selectedCategoryId || null,
      search: this.searchTerm.trim() || null,
      isFeatured: isFeaturedParam
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        this.products = response.items || [];
        this.currentPage = response.page;
        this.pageSize = response.page_size;
        this.totalProducts = response.total;
        this.totalPages = response.pages;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Unable to load products.';
        this.isLoading = false;
      }
    });
  }
  retryLoad() {
    this.loadProducts();
    if (this.categories.length === 0) {
      this.loadCategories();
    }
  }
  // ─── Stock Calculation ───────────────────────────────────────
  /**
   * Sum of all active variant stocks.
   * If there are no variants, display "—".
   */
  getTotalStock(product) {
    if (!product.variants || product.variants.length === 0) {
      return '—';
    }
    const sum = product.variants.filter(v => v.is_active).reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    return sum.toString();
  }
  isOutOfStock(product) {
    if (!product.variants || product.variants.length === 0) {
      return false;
    }
    const sum = product.variants.filter(v => v.is_active).reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    return sum === 0;
  }
  // ─── Image Resolution ────────────────────────────────────────
  /**
   * Primary image where is_primary === true.
   * If none, first image. Otherwise null (placeholder shown).
   */
  getProductPrimaryImage(product) {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    const primary = product.images.find(img => img.is_primary);
    return primary ? primary.image_url : product.images[0].image_url;
  }
  onImageError(event) {
    const target = event.target;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add('has-fallback');
    }
  }
  // ─── Category Name Lookup ────────────────────────────────────
  getCategoryLabel(product) {
    if (product.category && product.category.name) {
      return product.category.name;
    }
    const found = this.categories.find(c => c.id === product.category_id);
    return found ? found.name : 'Uncategorized';
  }
  // ─── Pagination Helpers ──────────────────────────────────────
  get pagesArray() {
    if (this.totalPages <= 1) return [1];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  get rangeStart() {
    if (this.totalProducts === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  get rangeEnd() {
    return Math.min(this.currentPage * this.pageSize, this.totalProducts);
  }
  changePage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage || this.isLoading) {
      return;
    }
    this.currentPage = page;
    this.loadProducts();
  }
  previousPage() {
    if (this.currentPage > 1 && !this.isLoading) {
      this.changePage(this.currentPage - 1);
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.changePage(this.currentPage + 1);
    }
  }
  // ─── Edit Navigation ─────────────────────────────────────────
  navigateToEdit(productId) {
    this.router.navigate(['/admin/products', productId, 'edit']);
  }
  // ─── Delete Flow ─────────────────────────────────────────────
  openDeleteConfirm(product) {
    this.productToDelete = product;
    this.deleteError = null;
    this.errorMessage = null;
  }
  closeDeleteConfirm() {
    if (this.isDeleting) return;
    this.productToDelete = null;
    this.deleteError = null;
  }
  confirmDelete() {
    if (!this.productToDelete) return;
    this.isDeleting = true;
    this.deleteError = null;
    const id = this.productToDelete.id;
    const name = this.productToDelete.name;
    this.adminProductService.deleteProduct(id).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: () => {
        this.isDeleting = false;
        this.productToDelete = null;
        this.successMessage = `Product "${name}" was deleted successfully.`;
        // If this was the last item on a page > 1, step back
        if (this.products.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.loadProducts();
      },
      error: err => {
        this.isDeleting = false;
        this.deleteError = err.message || 'Failed to delete product.';
      }
    });
  }
  dismissSuccessMessage() {
    this.successMessage = null;
  }
  dismissErrorMessage() {
    this.errorMessage = null;
  }
  static {
    this.ɵfac = function ProductsComponent_Factory(t) {
      return new (t || ProductsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_admin_product_service__WEBPACK_IMPORTED_MODULE_0__.AdminProductService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ProductsComponent,
      selectors: [["app-products"]],
      decls: 55,
      vars: 15,
      consts: [[1, "admin-products-page"], [1, "products-header"], [1, "header-left"], [1, "page-title"], [1, "title-glyph"], ["class", "inventory-badge", 4, "ngIf"], [1, "header-actions"], ["type", "button", "title", "Refresh inventory", 1, "btn", "btn--refresh", 3, "disabled", "click"], [1, "btn-icon"], ["routerLink", "/admin/products/new", 1, "btn", "btn--primary"], ["class", "system-alerts", 4, "ngIf"], ["aria-label", "Product Search and Filters", 1, "filter-panel"], [1, "search-field"], [1, "search-glyph"], ["type", "text", "placeholder", "Search products...", "aria-label", "Search products", 1, "form-control", "form-control--search", 3, "value", "input"], ["type", "button", "class", "clear-search-btn", "aria-label", "Clear search", 3, "click", 4, "ngIf"], [1, "filters-row"], [1, "filter-group"], ["for", "categoryFilter", 1, "filter-label"], [1, "select-wrapper"], ["id", "categoryFilter", 1, "form-control", "form-control--select", 3, "ngModel", "ngModelChange"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "select-caret"], ["for", "featuredFilter", 1, "filter-label"], ["id", "featuredFilter", 1, "form-control", "form-control--select", 3, "ngModel", "ngModelChange"], ["value", "all"], ["value", "featured"], ["value", "not_featured"], ["type", "button", "class", "btn btn--reset-filters", 3, "click", 4, "ngIf"], ["class", "status-card status-card--error", 4, "ngIf"], ["class", "loading-state-card", 4, "ngIf"], ["class", "inventory-card", 4, "ngIf"], ["class", "modal-overlay", "role", "dialog", "aria-modal", "true", "aria-labelledby", "deleteModalTitle", 3, "click", 4, "ngIf"], [1, "inventory-badge"], [1, "system-alerts"], ["class", "alert alert--success", 4, "ngIf"], ["class", "alert alert--error", 4, "ngIf"], [1, "alert", "alert--success"], [1, "alert-content"], [1, "alert-icon"], ["type", "button", "aria-label", "Close", 1, "alert-dismiss", 3, "click"], [1, "alert", "alert--error"], ["type", "button", "aria-label", "Clear search", 1, "clear-search-btn", 3, "click"], [3, "value"], ["type", "button", 1, "btn", "btn--reset-filters", 3, "click"], [1, "status-card", "status-card--error"], [1, "status-glyph"], [1, "status-title"], [1, "status-desc"], ["type", "button", 1, "btn", "btn--primary", "mt-16", 3, "click"], [1, "loading-state-card"], [1, "loading-header"], [1, "loading-spinner"], [1, "loading-text"], [1, "skeleton-table"], ["class", "skeleton-row", 4, "ngFor", "ngForOf"], [1, "skeleton-row"], [1, "skeleton-cell", "skeleton-thumb"], [1, "skeleton-cell", "skeleton-meta"], [1, "skeleton-line", "w-60"], [1, "skeleton-line", "w-30"], [1, "skeleton-cell", "skeleton-pill"], [1, "skeleton-cell", "skeleton-price"], [1, "skeleton-cell", "skeleton-stock"], [1, "skeleton-cell", "skeleton-actions"], [1, "inventory-card"], ["class", "table-container", 4, "ngIf"], ["class", "mobile-products-grid", 4, "ngIf"], ["class", "empty-state-card", 4, "ngIf"], ["class", "pagination-footer", 4, "ngIf"], [1, "table-container"], [1, "products-table"], ["scope", "col", 1, "th-product"], ["scope", "col", 1, "th-category"], ["scope", "col", 1, "th-price"], ["scope", "col", 1, "th-stock"], ["scope", "col", 1, "th-status"], ["scope", "col", 1, "th-actions", "text-right"], ["class", "product-row", 4, "ngFor", "ngForOf"], [1, "product-row"], [1, "td-product"], [1, "product-profile"], [1, "product-media"], ["loading", "lazy", 3, "src", "alt", "error", 4, "ngIf"], ["class", "media-fallback", 4, "ngIf"], [1, "product-info"], [1, "product-title", 3, "title"], [1, "product-slug"], ["class", "product-material", 4, "ngIf"], [1, "td-category"], [1, "badge", "badge--category"], [1, "td-price"], [1, "price-stack"], [1, "price-current"], ["class", "price-compare", 4, "ngIf"], [1, "td-stock"], [1, "stock-value"], [1, "td-status"], [1, "status-stack"], [1, "badge", "badge--status"], ["class", "badge badge--featured", 4, "ngIf"], [1, "td-actions", "text-right"], [1, "action-buttons"], ["type", "button", "title", "Edit product", 1, "btn-link", "btn-link--edit", 3, "click"], [1, "action-divider"], ["type", "button", "title", "Delete product", 1, "btn-link", "btn-link--delete", 3, "click"], ["loading", "lazy", 3, "src", "alt", "error"], [1, "media-fallback"], [1, "fallback-icon"], [1, "product-material"], [1, "material-label"], [1, "price-compare"], [1, "badge", "badge--featured"], [1, "mobile-products-grid"], ["class", "product-mobile-card", 4, "ngFor", "ngForOf"], [1, "product-mobile-card"], [1, "card-header-row"], [1, "card-meta"], [1, "product-title"], [1, "status-stack", "flex-row", "mt-4"], [1, "card-details-grid"], [1, "detail-item"], [1, "detail-label"], ["class", "detail-item", 4, "ngIf"], [1, "card-actions-row"], ["type", "button", 1, "btn", "btn--outline-edit", 3, "click"], ["type", "button", 1, "btn", "btn--outline-delete", 3, "click"], [1, "product-material-text"], [1, "empty-state-card"], [1, "empty-glyph"], [1, "empty-title"], [1, "empty-subtitle"], [1, "empty-actions"], ["type", "button", "class", "btn btn--outline ml-12", 3, "click", 4, "ngIf"], ["type", "button", 1, "btn", "btn--outline", "ml-12", 3, "click"], [1, "pagination-footer"], [1, "pagination-summary"], ["class", "pagination-nav", "aria-label", "Product pagination", 4, "ngIf"], ["aria-label", "Product pagination", 1, "pagination-nav"], ["type", "button", "aria-label", "Previous page", 1, "pagination-btn", "pagination-prev", 3, "disabled", "click"], [1, "page-numbers"], ["type", "button", "class", "pagination-page-btn", 3, "is-active", "disabled", "click", 4, "ngFor", "ngForOf"], ["type", "button", "aria-label", "Next page", 1, "pagination-btn", "pagination-next", 3, "disabled", "click"], ["type", "button", 1, "pagination-page-btn", 3, "disabled", "click"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "deleteModalTitle", 1, "modal-overlay", 3, "click"], [1, "modal-dialog", 3, "click"], [1, "modal-header"], ["id", "deleteModalTitle", 1, "modal-title", "modal-title--danger"], ["type", "button", "aria-label", "Close modal", 1, "modal-close-btn", 3, "disabled", "click"], [1, "modal-body"], [1, "delete-icon-wrap"], [1, "delete-confirm-text"], [1, "target-product-name"], [1, "delete-disclaimer"], ["class", "alert alert--error mt-12", 4, "ngIf"], [1, "modal-footer"], ["type", "button", 1, "btn", "btn--outline", 3, "disabled", "click"], ["type", "button", 1, "btn", "btn--danger", 3, "disabled", "click"], [4, "ngIf"], ["class", "is-loading-text", 4, "ngIf"], [1, "alert", "alert--error", "mt-12"], [1, "is-loading-text"], [1, "btn-spinner"]],
      template: function ProductsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header", 1)(2, "div", 2)(3, "h1", 3)(4, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "\uD83D\uDECD\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " Products ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, ProductsComponent_span_7_Template, 2, 2, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 6)(9, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProductsComponent_Template_button_click_9_listener() {
            return ctx.retryLoad();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "\u21BB");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Refresh");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "a", 9)(15, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "+");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Add Product");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, ProductsComponent_div_19_Template, 3, 2, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "section", 11)(21, "div", 12)(22, "span", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "\uD83D\uDD0D");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "input", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("input", function ProductsComponent_Template_input_input_24_listener($event) {
            return ctx.onSearchInput($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](25, ProductsComponent_button_25_Template, 2, 0, "button", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "div", 16)(27, "div", 17)(28, "label", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, "Category:");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 19)(31, "select", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function ProductsComponent_Template_select_ngModelChange_31_listener($event) {
            return ctx.selectedCategoryId = $event;
          })("ngModelChange", function ProductsComponent_Template_select_ngModelChange_31_listener() {
            return ctx.onCategoryChange();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "option", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "All Categories");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](34, ProductsComponent_option_34_Template, 2, 2, "option", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "\u25BC");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 17)(38, "label", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, "Featured:");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "div", 19)(41, "select", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function ProductsComponent_Template_select_ngModelChange_41_listener($event) {
            return ctx.selectedFeatured = $event;
          })("ngModelChange", function ProductsComponent_Template_select_ngModelChange_41_listener() {
            return ctx.onFeaturedChange();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "option", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "All");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "option", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Featured");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "option", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Not Featured");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49, "\u25BC");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](50, ProductsComponent_button_50_Template, 2, 0, "button", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](51, ProductsComponent_div_51_Template, 9, 1, "div", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](52, ProductsComponent_div_52_Template, 7, 2, "div", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](53, ProductsComponent_div_53_Template, 5, 4, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](54, ProductsComponent_div_54_Template, 23, 7, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("is-spinning", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.successMessage || ctx.errorMessage);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", ctx.searchTerm);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.searchTerm);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.selectedCategoryId);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.categories);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.selectedFeatured);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isFiltered);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.errorMessage && !ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isLoading && !ctx.errorMessage);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.productToDelete);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgModel, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_7__.DecimalPipe],
      styles: [".admin-products-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1280px;\n  margin: 0 auto;\n  font-family: \"Poppins\", sans-serif;\n  color: #f5f5f5;\n}\n\n.products-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.products-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n}\n.products-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: clamp(1.5rem, 3.2vw, 2.1rem);\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  color: #39ff14;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin: 0;\n  text-shadow: 0 0 16px rgba(57, 255, 20, 0.35);\n}\n.products-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%]   .title-glyph[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n}\n.products-header[_ngcontent-%COMP%]   .inventory-badge[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.08);\n  border: 1px solid rgba(57, 255, 20, 0.3);\n  color: #39ff14;\n  font-size: 0.76rem;\n  font-family: \"Oswald\", sans-serif;\n  letter-spacing: 1px;\n  padding: 4px 12px;\n  border-radius: 20px;\n  text-transform: uppercase;\n}\n.products-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 10px 20px;\n  border-radius: 6px;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.92rem;\n  letter-spacing: 1.2px;\n  text-transform: uppercase;\n  font-weight: 600;\n  text-decoration: none;\n  cursor: pointer !important;\n  border: 1px solid transparent;\n  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #39ff14;\n  color: #050a06;\n  border-color: #39ff14;\n  box-shadow: 0 0 14px rgba(57, 255, 20, 0.35);\n}\n.btn--primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #53ff33;\n  box-shadow: 0 0 22px rgba(57, 255, 20, 0.6);\n  transform: translateY(-1px);\n}\n.btn--primary[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0);\n}\n.btn--refresh[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.04);\n  color: #f5f5f5;\n  border-color: rgba(57, 255, 20, 0.15);\n}\n.btn--refresh[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: rgba(57, 255, 20, 0.08);\n  border-color: #39ff14;\n  color: #39ff14;\n}\n.btn--outline[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #8a9a8c;\n  border-color: rgba(255, 255, 255, 0.16);\n}\n.btn--outline[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.06);\n  color: #f5f5f5;\n}\n.btn--danger[_ngcontent-%COMP%] {\n  background: #ff3b3b;\n  color: #fff;\n  border-color: #ff3b3b;\n  box-shadow: 0 0 14px rgba(255, 59, 59, 0.35);\n}\n.btn--danger[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #ff5a5a;\n  box-shadow: 0 0 22px rgba(255, 59, 59, 0.55);\n}\n.btn--reset-filters[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #8a9a8c;\n  border-color: rgba(255, 255, 255, 0.12);\n  font-size: 0.78rem;\n  padding: 8px 12px;\n}\n.btn--reset-filters[_ngcontent-%COMP%]:hover {\n  color: #39ff14;\n  border-color: rgba(57, 255, 20, 0.16);\n}\n.btn--outline-edit[_ngcontent-%COMP%] {\n  padding: 7px 14px;\n  background: rgba(57, 255, 20, 0.06);\n  color: #39ff14;\n  border: 1px solid rgba(57, 255, 20, 0.25);\n  font-size: 0.82rem;\n  border-radius: 4px;\n}\n.btn--outline-edit[_ngcontent-%COMP%]:hover {\n  background: #39ff14;\n  color: #000;\n}\n.btn--outline-delete[_ngcontent-%COMP%] {\n  padding: 7px 14px;\n  background: rgba(255, 59, 59, 0.12);\n  color: #ff3b3b;\n  border: 1px solid rgba(255, 59, 59, 0.3);\n  font-size: 0.82rem;\n  border-radius: 4px;\n}\n.btn--outline-delete[_ngcontent-%COMP%]:hover {\n  background: #ff3b3b;\n  color: #fff;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.45;\n  cursor: not-allowed !important;\n}\n.btn[_ngcontent-%COMP%]   .btn-icon.is-spinning[_ngcontent-%COMP%] {\n  display: inline-block;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n\n.system-alerts[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-bottom: 20px;\n}\n\n.alert[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 18px;\n  border-radius: 8px;\n  font-size: 0.88rem;\n  line-height: 1.4;\n}\n.alert[_ngcontent-%COMP%]   .alert-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.alert[_ngcontent-%COMP%]   .alert-icon[_ngcontent-%COMP%] {\n  font-weight: bold;\n  font-size: 1rem;\n}\n.alert[_ngcontent-%COMP%]   .alert-dismiss[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: inherit;\n  font-size: 1rem;\n  opacity: 0.7;\n  cursor: pointer !important;\n  padding: 0 4px;\n  line-height: 1;\n}\n.alert[_ngcontent-%COMP%]   .alert-dismiss[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.alert--success[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.1);\n  border: 1px solid rgba(57, 255, 20, 0.35);\n  color: #4aff28;\n}\n.alert--error[_ngcontent-%COMP%] {\n  background: rgba(255, 59, 59, 0.12);\n  border: 1px solid rgba(255, 59, 59, 0.35);\n  color: #ff6b6b;\n}\n\n.filter-panel[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 22px;\n  flex-wrap: wrap;\n  align-items: center;\n  background: #0e1810;\n  padding: 16px 20px;\n  border-radius: 10px;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n}\n.filter-panel[_ngcontent-%COMP%]   .search-field[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 260px;\n  position: relative;\n}\n.filter-panel[_ngcontent-%COMP%]   .search-field[_ngcontent-%COMP%]   .search-glyph[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 14px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 0.95rem;\n  pointer-events: none;\n  opacity: 0.6;\n}\n.filter-panel[_ngcontent-%COMP%]   .search-field[_ngcontent-%COMP%]   .clear-search-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  color: #8a9a8c;\n  font-size: 0.85rem;\n  cursor: pointer !important;\n  padding: 4px;\n}\n.filter-panel[_ngcontent-%COMP%]   .search-field[_ngcontent-%COMP%]   .clear-search-btn[_ngcontent-%COMP%]:hover {\n  color: #f5f5f5;\n}\n.filter-panel[_ngcontent-%COMP%]   .filters-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n}\n.filter-panel[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.filter-panel[_ngcontent-%COMP%]   .filter-label[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: #8a9a8c;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.filter-panel[_ngcontent-%COMP%]   .select-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-block;\n}\n.filter-panel[_ngcontent-%COMP%]   .select-wrapper[_ngcontent-%COMP%]   .select-caret[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  pointer-events: none;\n  font-size: 0.65rem;\n  color: #8a9a8c;\n}\n\n.form-control[_ngcontent-%COMP%] {\n  background: #070d08;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 6px;\n  color: #f5f5f5;\n  font-family: \"Poppins\", sans-serif;\n  font-size: 0.88rem;\n  padding: 9px 14px;\n  transition: all 0.2s ease;\n  outline: none;\n}\n.form-control[_ngcontent-%COMP%]:focus {\n  border-color: #39ff14;\n  box-shadow: 0 0 10px rgba(57, 255, 20, 0.2);\n}\n.form-control--search[_ngcontent-%COMP%] {\n  width: 100%;\n  padding-left: 40px;\n  padding-right: 36px;\n}\n.form-control--select[_ngcontent-%COMP%] {\n  padding-right: 32px;\n  appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer !important;\n  min-width: 160px;\n}\n.form-control--select[_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {\n  background: #0d160e;\n  color: #f5f5f5;\n}\n\n.inventory-card[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);\n}\n\n.table-container[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  width: 100%;\n}\n@media (max-width: 860px) {\n  .table-container[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n\n.products-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.88rem;\n}\n.products-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #070d08;\n  border-bottom: 1px solid rgba(57, 255, 20, 0.15);\n}\n.products-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 14px 18px;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.78rem;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  color: #8a9a8c;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.products-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(57, 255, 20, 0.07);\n  transition: background 0.18s ease;\n}\n.products-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: rgba(57, 255, 20, 0.035);\n}\n.products-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 14px 18px;\n  vertical-align: middle;\n}\n.products-table[_ngcontent-%COMP%]   .text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n\n.product-profile[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  min-width: 250px;\n}\n\n.product-media[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 6px;\n  background: #070c08;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.product-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.product-media[_ngcontent-%COMP%]   .media-fallback[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  opacity: 0.7;\n}\n\n.product-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.product-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #f5f5f5;\n  font-size: 0.92rem;\n  line-height: 1.25;\n}\n\n.product-slug[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  color: #8a9a8c;\n  font-family: monospace;\n}\n\n.product-material[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #39ff14;\n  opacity: 0.85;\n}\n.product-material[_ngcontent-%COMP%]   .material-label[_ngcontent-%COMP%] {\n  color: #8a9a8c;\n}\n\n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 3px 8px;\n  border-radius: 4px;\n  font-size: 0.74rem;\n  font-weight: 500;\n  letter-spacing: 0.5px;\n  width: -moz-fit-content;\n  width: fit-content;\n}\n.badge--category[_ngcontent-%COMP%] {\n  background: rgba(255, 183, 3, 0.1);\n  color: #ffb703;\n  border: 1px solid rgba(255, 183, 3, 0.28);\n}\n.badge--status[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-family: \"Oswald\", sans-serif;\n  letter-spacing: 1px;\n  font-size: 0.7rem;\n}\n.badge--active[_ngcontent-%COMP%] {\n  background: rgba(57, 255, 20, 0.12);\n  color: #39ff14;\n  border: 1px solid rgba(57, 255, 20, 0.35);\n}\n.badge--inactive[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.08);\n  color: #8a9a8c;\n  border: 1px solid rgba(255, 255, 255, 0.14);\n}\n.badge--featured[_ngcontent-%COMP%] {\n  background: rgba(255, 183, 3, 0.16);\n  color: #ffb703;\n  border: 1px solid rgba(255, 183, 3, 0.4);\n  font-size: 0.68rem;\n  font-weight: 600;\n}\n\n.status-stack[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.status-stack.flex-row[_ngcontent-%COMP%] {\n  flex-direction: row;\n  flex-wrap: wrap;\n}\n\n.price-stack[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n.price-stack[_ngcontent-%COMP%]   .price-current[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #39ff14;\n  font-size: 0.95rem;\n}\n.price-stack[_ngcontent-%COMP%]   .price-compare[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  color: #8a9a8c;\n  text-decoration: line-through;\n}\n\n.stock-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #f5f5f5;\n  font-size: 0.9rem;\n}\n.stock-value--zero[_ngcontent-%COMP%] {\n  color: #ff6b6b;\n}\n.stock-value--none[_ngcontent-%COMP%] {\n  color: #526054;\n  font-size: 1.1rem;\n}\n\n.action-buttons[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.btn-link[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  padding: 2px 4px;\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer !important;\n  transition: all 0.18s ease;\n}\n.btn-link--edit[_ngcontent-%COMP%] {\n  color: #39ff14;\n}\n.btn-link--edit[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n  color: #64ff47;\n}\n.btn-link--delete[_ngcontent-%COMP%] {\n  color: #ff3b3b;\n}\n.btn-link--delete[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n  color: #ff6e6e;\n}\n\n.action-divider[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.18);\n  font-size: 0.8rem;\n}\n\n.mobile-products-grid[_ngcontent-%COMP%] {\n  display: none;\n  padding: 16px;\n  gap: 14px;\n  flex-direction: column;\n}\n@media (max-width: 860px) {\n  .mobile-products-grid[_ngcontent-%COMP%] {\n    display: flex;\n  }\n}\n\n.product-mobile-card[_ngcontent-%COMP%] {\n  background: #09110a;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 8px;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .card-header-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .card-meta[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .card-meta[_ngcontent-%COMP%]   .product-title[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  margin-bottom: 2px;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .card-details-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 10px;\n  background: rgba(0, 0, 0, 0.25);\n  padding: 10px 12px;\n  border-radius: 6px;\n  border: 1px solid rgba(255, 255, 255, 0.04);\n}\n.product-mobile-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .detail-label[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  color: #8a9a8c;\n  font-family: \"Oswald\", sans-serif;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .product-material-text[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #39ff14;\n}\n.product-mobile-card[_ngcontent-%COMP%]   .card-actions-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  justify-content: flex-end;\n  padding-top: 4px;\n}\n\n.empty-state-card[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 56px 24px;\n}\n.empty-state-card[_ngcontent-%COMP%]   .empty-glyph[_ngcontent-%COMP%], .empty-state-card[_ngcontent-%COMP%]   .status-glyph[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .empty-glyph[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .status-glyph[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 12px;\n}\n.empty-state-card[_ngcontent-%COMP%]   .empty-title[_ngcontent-%COMP%], .empty-state-card[_ngcontent-%COMP%]   .status-title[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .empty-title[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .status-title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 1.5rem;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  color: #f5f5f5;\n  margin-bottom: 6px;\n}\n.empty-state-card[_ngcontent-%COMP%]   .empty-subtitle[_ngcontent-%COMP%], .empty-state-card[_ngcontent-%COMP%]   .status-desc[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .empty-subtitle[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .status-desc[_ngcontent-%COMP%] {\n  color: #8a9a8c;\n  font-size: 0.9rem;\n  max-width: 440px;\n  margin: 0 auto 20px;\n  line-height: 1.5;\n}\n.empty-state-card[_ngcontent-%COMP%]   .empty-actions[_ngcontent-%COMP%], .status-card[_ngcontent-%COMP%]   .empty-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n\n.status-card--error[_ngcontent-%COMP%] {\n  background: rgba(255, 59, 59, 0.05);\n  border: 1px solid rgba(255, 59, 59, 0.2);\n  border-radius: 10px;\n  margin-bottom: 20px;\n}\n.status-card--error[_ngcontent-%COMP%]   .status-title[_ngcontent-%COMP%] {\n  color: #ff6b6b;\n}\n\n.loading-state-card[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(57, 255, 20, 0.15);\n  border-radius: 10px;\n  padding: 24px;\n  margin-bottom: 24px;\n}\n.loading-state-card[_ngcontent-%COMP%]   .loading-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 20px;\n  padding-bottom: 14px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n}\n.loading-state-card[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  border: 2px solid rgba(57, 255, 20, 0.2);\n  border-top-color: #39ff14;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.8s linear infinite;\n}\n.loading-state-card[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.92rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  color: #39ff14;\n  margin: 0;\n}\n\n.skeleton-table[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.skeleton-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 12px 14px;\n  background: #080f09;\n  border-radius: 6px;\n  border: 1px solid rgba(255, 255, 255, 0.03);\n}\n\n.skeleton-cell[_ngcontent-%COMP%] {\n  background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(57, 255, 20, 0.06) 50%, rgba(255, 255, 255, 0.03) 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n  border-radius: 4px;\n}\n\n.skeleton-thumb[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  flex-shrink: 0;\n}\n\n.skeleton-meta[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  background: none;\n}\n.skeleton-meta[_ngcontent-%COMP%]   .skeleton-line[_ngcontent-%COMP%] {\n  height: 12px;\n  border-radius: 3px;\n  background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(57, 255, 20, 0.06) 50%, rgba(255, 255, 255, 0.03) 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n}\n.skeleton-meta[_ngcontent-%COMP%]   .skeleton-line.w-60[_ngcontent-%COMP%] {\n  width: 60%;\n}\n.skeleton-meta[_ngcontent-%COMP%]   .skeleton-line.w-30[_ngcontent-%COMP%] {\n  width: 30%;\n}\n\n.skeleton-pill[_ngcontent-%COMP%] {\n  width: 90px;\n  height: 22px;\n}\n\n.skeleton-price[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 18px;\n}\n\n.skeleton-stock[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 18px;\n}\n\n.skeleton-actions[_ngcontent-%COMP%] {\n  width: 90px;\n  height: 20px;\n}\n\n.pagination-footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-top: 1px solid rgba(57, 255, 20, 0.15);\n  background: #080d09;\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.pagination-footer[_ngcontent-%COMP%]   .pagination-summary[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: #8a9a8c;\n}\n.pagination-footer[_ngcontent-%COMP%]   .pagination-nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.pagination-footer[_ngcontent-%COMP%]   .page-numbers[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.pagination-footer[_ngcontent-%COMP%]   .pagination-btn[_ngcontent-%COMP%], .pagination-footer[_ngcontent-%COMP%]   .pagination-page-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  color: #f5f5f5;\n  font-family: \"Oswald\", sans-serif;\n  font-size: 0.84rem;\n  letter-spacing: 0.5px;\n  padding: 6px 12px;\n  border-radius: 4px;\n  cursor: pointer !important;\n  transition: all 0.18s ease;\n}\n.pagination-footer[_ngcontent-%COMP%]   .pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled), .pagination-footer[_ngcontent-%COMP%]   .pagination-page-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #39ff14;\n  color: #39ff14;\n  background: rgba(57, 255, 20, 0.08);\n}\n.pagination-footer[_ngcontent-%COMP%]   .pagination-btn[_ngcontent-%COMP%]:disabled, .pagination-footer[_ngcontent-%COMP%]   .pagination-page-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.35;\n  cursor: not-allowed !important;\n}\n.pagination-footer[_ngcontent-%COMP%]   .pagination-btn.is-active[_ngcontent-%COMP%], .pagination-footer[_ngcontent-%COMP%]   .pagination-page-btn.is-active[_ngcontent-%COMP%] {\n  background: #39ff14;\n  color: #000;\n  border-color: #39ff14;\n  font-weight: 700;\n  box-shadow: 0 0 10px rgba(57, 255, 20, 0.35);\n}\n\n.modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.8);\n  backdrop-filter: blur(4px);\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease;\n}\n\n.modal-dialog[_ngcontent-%COMP%] {\n  background: #0e1810;\n  border: 1px solid rgba(255, 59, 59, 0.35);\n  border-radius: 12px;\n  width: 100%;\n  max-width: 480px;\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);\n  overflow: hidden;\n  animation: _ngcontent-%COMP%_scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n  background: #080d09;\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-title[_ngcontent-%COMP%] {\n  font-family: \"Oswald\", sans-serif;\n  font-size: 1.15rem;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  margin: 0;\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-title--danger[_ngcontent-%COMP%] {\n  color: #ff6b6b;\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-close-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: #8a9a8c;\n  font-size: 1.1rem;\n  cursor: pointer !important;\n  padding: 4px;\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-close-btn[_ngcontent-%COMP%]:hover {\n  color: #f5f5f5;\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  padding: 24px 20px;\n  text-align: center;\n}\n.modal-dialog[_ngcontent-%COMP%]   .delete-icon-wrap[_ngcontent-%COMP%] {\n  font-size: 2.4rem;\n  margin-bottom: 10px;\n}\n.modal-dialog[_ngcontent-%COMP%]   .delete-confirm-text[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  color: #f5f5f5;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n.modal-dialog[_ngcontent-%COMP%]   .target-product-name[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 700;\n  color: #39ff14;\n  font-family: \"Oswald\", sans-serif;\n  letter-spacing: 1px;\n  margin-bottom: 14px;\n  word-break: break-word;\n}\n.modal-dialog[_ngcontent-%COMP%]   .delete-disclaimer[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #8a9a8c;\n  line-height: 1.45;\n}\n.modal-dialog[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  padding: 16px 20px;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n  background: #080d09;\n}\n.modal-dialog[_ngcontent-%COMP%]   .btn-spinner[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  display: inline-block;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n  vertical-align: middle;\n  margin-right: 6px;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_scaleUp {\n  from {\n    opacity: 0;\n    transform: scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n.mt-4[_ngcontent-%COMP%] {\n  margin-top: 4px;\n}\n\n.mt-12[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n\n.mt-16[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n\n.ml-12[_ngcontent-%COMP%] {\n  margin-left: 12px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYWRtaW4vcGFnZXMvcHJvZHVjdHMvcHJvZHVjdHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMEJBO0VBQ0UsYUFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLGtDQVBZO0VBUVosY0FoQlk7QUFUZDs7QUE2QkE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLFNBQUE7QUExQkY7QUE0QkU7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsZUFBQTtBQTFCSjtBQTZCRTtFQUNFLGlDQTdCVTtFQThCVix1Q0FBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxjQXREVTtFQXVEVixhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsU0FBQTtFQUNBLDZDQUFBO0FBM0JKO0FBNkJJO0VBQ0UsaUJBQUE7QUEzQk47QUErQkU7RUFDRSxtQ0FsRVU7RUFtRVYsd0NBQUE7RUFDQSxjQXJFVTtFQXNFVixrQkFBQTtFQUNBLGlDQWxEVTtFQW1EVixtQkFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSx5QkFBQTtBQTdCSjtBQWdDRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7QUE5Qko7O0FBbUNBO0VBQ0Usb0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQ0F4RVk7RUF5RVosa0JBQUE7RUFDQSxxQkFBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLDBCQUFBO0VBQ0EsNkJBQUE7RUFDQSxrREFBQTtBQWhDRjtBQWtDRTtFQUNFLG1CQXhHVTtFQXlHVixjQUFBO0VBQ0EscUJBMUdVO0VBMkdWLDRDQUFBO0FBaENKO0FBa0NJO0VBQ0UsbUJBQUE7RUFDQSwyQ0FBQTtFQUNBLDJCQUFBO0FBaENOO0FBbUNJ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QUFBO0FBcklKOztBQTBJQTtFQUNFO0lBQU8sdUJBQUE7RUF0SVA7RUF1SUE7SUFBSyx5QkFBQTtFQXBJTDtBQUNGO0FBc0lBO0VBQ0U7SUFBSyw0QkFBQTtFQW5JTDtFQW9JQTtJQUFPLDJCQUFBO0VBaklQO0FBQ0Y7QUFtSUE7RUFDRTtJQUFPLFVBQUE7RUFoSVA7RUFpSUE7SUFBSyxVQUFBO0VBOUhMO0FBQ0Y7QUFnSUE7RUFDRTtJQUNFLFVBQUE7SUFDQSxzQkFBQTtFQTlIRjtFQWdJQTtJQUNFLFVBQUE7SUFDQSxtQkFBQTtFQTlIRjtBQUNGO0FBaUlBO0VBQVMsZUFBQTtBQTlIVDs7QUErSEE7RUFBUyxnQkFBQTtBQTNIVDs7QUE0SEE7RUFBUyxnQkFBQTtBQXhIVDs7QUF5SEE7RUFBUyxpQkFBQTtBQXJIVCIsInNvdXJjZXNDb250ZW50IjpbIi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBWYXJpYWJsZXMgJiBUb2tlbnMgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4kbmVvbjogICAgICAgICMzOWZmMTQ7XG4kbmVvbi1kaW06ICAgIHJnYmEoNTcsIDI1NSwgMjAsIDAuMDgpO1xuJG5lb24tYm9yZGVyOiByZ2JhKDU3LCAyNTUsIDIwLCAwLjE2KTtcbiRuZW9uLWdsb3c6ICAgcmdiYSg1NywgMjU1LCAyMCwgMC4zNSk7XG5cbiRiZy1ib2R5OiAgICAgIzBiMGYwYztcbiRiZy1jYXJkOiAgICAgIzBlMTgxMDtcbiRiZy1wYW5lbDogICAgIzBhMTIwYjtcbiRiZy1pbnB1dDogICAgIzA3MGQwODtcbiRiZy1yb3ctYWx0OiAgIzBhMTMwYztcblxuJGJvcmRlcjogICAgICByZ2JhKDU3LCAyNTUsIDIwLCAwLjE1KTtcbiRib3JkZXItZGltOiAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcblxuJHdoaXRlOiAgICAgICAjZjVmNWY1O1xuJG11dGVkOiAgICAgICAjOGE5YThjO1xuJG11dGVkLWRhcms6ICAjNTI2MDU0O1xuJGdvbGQ6ICAgICAgICAjZmZiNzAzO1xuJHJlZDogICAgICAgICAjZmYzYjNiO1xuJHJlZC1kaW06ICAgICByZ2JhKDI1NSwgNTksIDU5LCAwLjEyKTtcblxuJGZvbnQtZGlzcDogICAnT3N3YWxkJywgc2Fucy1zZXJpZjtcbiRmb250LWJvZHk6ICAgJ1BvcHBpbnMnLCBzYW5zLXNlcmlmO1xuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgSG9zdCBDb250YWluZXIgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYWRtaW4tcHJvZHVjdHMtcGFnZSB7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIG1heC13aWR0aDogMTI4MHB4O1xuICBtYXJnaW46IDAgYXV0bztcbiAgZm9udC1mYW1pbHk6ICRmb250LWJvZHk7XG4gIGNvbG9yOiAkd2hpdGU7XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBIZWFkZXIgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4ucHJvZHVjdHMtaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMTZweDtcblxuICAuaGVhZGVyLWxlZnQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDE0cHg7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICB9XG5cbiAgLnBhZ2UtdGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICAgIGZvbnQtc2l6ZTogY2xhbXAoMS41cmVtLCAzLjJ2dywgMi4xcmVtKTtcbiAgICBsZXR0ZXItc3BhY2luZzogMnB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY29sb3I6ICRuZW9uO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEwcHg7XG4gICAgbWFyZ2luOiAwO1xuICAgIHRleHQtc2hhZG93OiAwIDAgMTZweCAkbmVvbi1nbG93O1xuXG4gICAgLnRpdGxlLWdseXBoIHtcbiAgICAgIGZvbnQtc2l6ZTogMS42cmVtO1xuICAgIH1cbiAgfVxuXG4gIC5pbnZlbnRvcnktYmFkZ2Uge1xuICAgIGJhY2tncm91bmQ6ICRuZW9uLWRpbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjMpO1xuICAgIGNvbG9yOiAkbmVvbjtcbiAgICBmb250LXNpemU6IDAuNzZyZW07XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIH1cblxuICAuaGVhZGVyLWFjdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEycHg7XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIEJ1dHRvbnMgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYnRuIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBnYXA6IDhweDtcbiAgcGFkZGluZzogMTBweCAyMHB4O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICBmb250LXNpemU6IDAuOTJyZW07XG4gIGxldHRlci1zcGFjaW5nOiAxLjJweDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXIgIWltcG9ydGFudDtcbiAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGN1YmljLWJlemllcigwLjE2LCAxLCAwLjMsIDEpO1xuXG4gICYtLXByaW1hcnkge1xuICAgIGJhY2tncm91bmQ6ICRuZW9uO1xuICAgIGNvbG9yOiAjMDUwYTA2O1xuICAgIGJvcmRlci1jb2xvcjogJG5lb247XG4gICAgYm94LXNoYWRvdzogMCAwIDE0cHggJG5lb24tZ2xvdztcblxuICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZDogbGlnaHRlbigkbmVvbiwgNiUpO1xuICAgICAgYm94LXNoYWRvdzogMCAwIDIycHggcmdiYSg1NywgMjU1LCAyMCwgMC42KTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcbiAgICB9XG5cbiAgICAmOmFjdGl2ZTpub3QoOmRpc2FibGVkKSB7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxuICB9XG5cbiAgJi0tcmVmcmVzaCB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KTtcbiAgICBjb2xvcjogJHdoaXRlO1xuICAgIGJvcmRlci1jb2xvcjogJGJvcmRlcjtcblxuICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZDogJG5lb24tZGltO1xuICAgICAgYm9yZGVyLWNvbG9yOiAkbmVvbjtcbiAgICAgIGNvbG9yOiAkbmVvbjtcbiAgICB9XG4gIH1cblxuICAmLS1vdXRsaW5lIHtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBjb2xvcjogJG11dGVkO1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE2KTtcblxuICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA2KTtcbiAgICAgIGNvbG9yOiAkd2hpdGU7XG4gICAgfVxuICB9XG5cbiAgJi0tZGFuZ2VyIHtcbiAgICBiYWNrZ3JvdW5kOiAkcmVkO1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIGJvcmRlci1jb2xvcjogJHJlZDtcbiAgICBib3gtc2hhZG93OiAwIDAgMTRweCByZ2JhKDI1NSwgNTksIDU5LCAwLjM1KTtcblxuICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZDogbGlnaHRlbigkcmVkLCA2JSk7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMjJweCByZ2JhKDI1NSwgNTksIDU5LCAwLjU1KTtcbiAgICB9XG4gIH1cblxuICAmLS1yZXNldC1maWx0ZXJzIHtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBjb2xvcjogJG11dGVkO1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcbiAgICBmb250LXNpemU6IDAuNzhyZW07XG4gICAgcGFkZGluZzogOHB4IDEycHg7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGNvbG9yOiAkbmVvbjtcbiAgICAgIGJvcmRlci1jb2xvcjogJG5lb24tYm9yZGVyO1xuICAgIH1cbiAgfVxuXG4gICYtLW91dGxpbmUtZWRpdCB7XG4gICAgcGFkZGluZzogN3B4IDE0cHg7XG4gICAgYmFja2dyb3VuZDogcmdiYSg1NywgMjU1LCAyMCwgMC4wNik7XG4gICAgY29sb3I6ICRuZW9uO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoNTcsIDI1NSwgMjAsIDAuMjUpO1xuICAgIGZvbnQtc2l6ZTogMC44MnJlbTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6ICRuZW9uO1xuICAgICAgY29sb3I6ICMwMDA7XG4gICAgfVxuICB9XG5cbiAgJi0tb3V0bGluZS1kZWxldGUge1xuICAgIHBhZGRpbmc6IDdweCAxNHB4O1xuICAgIGJhY2tncm91bmQ6ICRyZWQtZGltO1xuICAgIGNvbG9yOiAkcmVkO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCA1OSwgNTksIDAuMyk7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogJHJlZDtcbiAgICAgIGNvbG9yOiAjZmZmO1xuICAgIH1cbiAgfVxuXG4gICY6ZGlzYWJsZWQge1xuICAgIG9wYWNpdHk6IDAuNDU7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZCAhaW1wb3J0YW50O1xuICB9XG5cbiAgLmJ0bi1pY29uLmlzLXNwaW5uaW5nIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgQWxlcnRzICYgTm90aWZpY2F0aW9ucyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5zeXN0ZW0tYWxlcnRzIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAxMHB4O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xufVxuXG4uYWxlcnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDEycHggMThweDtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBmb250LXNpemU6IDAuODhyZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XG5cbiAgLmFsZXJ0LWNvbnRlbnQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEwcHg7XG4gIH1cblxuICAuYWxlcnQtaWNvbiB7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgZm9udC1zaXplOiAxcmVtO1xuICB9XG5cbiAgLmFsZXJ0LWRpc21pc3Mge1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICBvcGFjaXR5OiAwLjc7XG4gICAgY3Vyc29yOiBwb2ludGVyICFpbXBvcnRhbnQ7XG4gICAgcGFkZGluZzogMCA0cHg7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG5cbiAgJi0tc3VjY2VzcyB7XG4gICAgYmFja2dyb3VuZDogcmdiYSg1NywgMjU1LCAyMCwgMC4xKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjM1KTtcbiAgICBjb2xvcjogIzRhZmYyODtcbiAgfVxuXG4gICYtLWVycm9yIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgNTksIDU5LCAwLjEyKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgNTksIDU5LCAwLjM1KTtcbiAgICBjb2xvcjogI2ZmNmI2YjtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRmlsdGVyIFBhbmVsIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLmZpbHRlci1wYW5lbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTZweDtcbiAgbWFyZ2luLWJvdHRvbTogMjJweDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kOiAkYmctY2FyZDtcbiAgcGFkZGluZzogMTZweCAyMHB4O1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xuXG4gIC5zZWFyY2gtZmllbGQge1xuICAgIGZsZXg6IDE7XG4gICAgbWluLXdpZHRoOiAyNjBweDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAuc2VhcmNoLWdseXBoIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDE0cHg7XG4gICAgICB0b3A6IDUwJTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgb3BhY2l0eTogMC42O1xuICAgIH1cblxuICAgIC5jbGVhci1zZWFyY2gtYnRuIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiAxMnB4O1xuICAgICAgdG9wOiA1MCU7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gICAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgY29sb3I6ICRtdXRlZDtcbiAgICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICAgIGN1cnNvcjogcG9pbnRlciAhaW1wb3J0YW50O1xuICAgICAgcGFkZGluZzogNHB4O1xuXG4gICAgICAmOmhvdmVyIHtcbiAgICAgICAgY29sb3I6ICR3aGl0ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuZmlsdGVycy1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDE0cHg7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICB9XG5cbiAgLmZpbHRlci1ncm91cCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuICB9XG5cbiAgLmZpbHRlci1sYWJlbCB7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG5cbiAgLnNlbGVjdC13cmFwcGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXG4gICAgLnNlbGVjdC1jYXJldCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogMTJweDtcbiAgICAgIHRvcDogNTAlO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICBmb250LXNpemU6IDAuNjVyZW07XG4gICAgICBjb2xvcjogJG11dGVkO1xuICAgIH1cbiAgfVxufVxuXG4vLyBGb3JtIGlucHV0c1xuLmZvcm0tY29udHJvbCB7XG4gIGJhY2tncm91bmQ6ICRiZy1pbnB1dDtcbiAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlcjtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBjb2xvcjogJHdoaXRlO1xuICBmb250LWZhbWlseTogJGZvbnQtYm9keTtcbiAgZm9udC1zaXplOiAwLjg4cmVtO1xuICBwYWRkaW5nOiA5cHggMTRweDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgb3V0bGluZTogbm9uZTtcblxuICAmOmZvY3VzIHtcbiAgICBib3JkZXItY29sb3I6ICRuZW9uO1xuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4IHJnYmEoNTcsIDI1NSwgMjAsIDAuMik7XG4gIH1cblxuICAmLS1zZWFyY2gge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBhZGRpbmctbGVmdDogNDBweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAzNnB4O1xuICB9XG5cbiAgJi0tc2VsZWN0IHtcbiAgICBwYWRkaW5nLXJpZ2h0OiAzMnB4O1xuICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlciAhaW1wb3J0YW50O1xuICAgIG1pbi13aWR0aDogMTYwcHg7XG5cbiAgICBvcHRpb24ge1xuICAgICAgYmFja2dyb3VuZDogIzBkMTYwZTtcbiAgICAgIGNvbG9yOiAkd2hpdGU7XG4gICAgfVxuICB9XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBJbnZlbnRvcnkgQ2FyZCAoQ29udGFpbmVyIGZvciBUYWJsZSkgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uaW52ZW50b3J5LWNhcmQge1xuICBiYWNrZ3JvdW5kOiAkYmctY2FyZDtcbiAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlcjtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm94LXNoYWRvdzogMCA4cHggMzBweCByZ2JhKDAsIDAsIDAsIDAuNDUpO1xufVxuXG4udGFibGUtY29udGFpbmVyIHtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgd2lkdGg6IDEwMCU7XG5cbiAgQG1lZGlhIChtYXgtd2lkdGg6IDg2MHB4KSB7XG4gICAgZGlzcGxheTogbm9uZTsgLy8gc3dpdGNoIHRvIG1vYmlsZSBjYXJkcyBvbiBzbWFsbGVyIHNjcmVlbnNcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgVGFibGUgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4ucHJvZHVjdHMtdGFibGUge1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgZm9udC1zaXplOiAwLjg4cmVtO1xuXG4gIHRoZWFkIHRyIHtcbiAgICBiYWNrZ3JvdW5kOiAjMDcwZDA4O1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAkYm9yZGVyO1xuICB9XG5cbiAgdGgge1xuICAgIHBhZGRpbmc6IDE0cHggMThweDtcbiAgICBmb250LWZhbWlseTogJGZvbnQtZGlzcDtcbiAgICBmb250LXNpemU6IDAuNzhyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IDEuNXB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY29sb3I6ICRtdXRlZDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIH1cblxuICB0Ym9keSB0ciB7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoNTcsIDI1NSwgMjAsIDAuMDcpO1xuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4xOHMgZWFzZTtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogcmdiYSg1NywgMjU1LCAyMCwgMC4wMzUpO1xuICAgIH1cbiAgfVxuXG4gIHRkIHtcbiAgICBwYWRkaW5nOiAxNHB4IDE4cHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgfVxuXG4gIC50ZXh0LXJpZ2h0IHtcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgUHJvZHVjdCBDZWxsIChNZWRpYSArIEluZm8pIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLnByb2R1Y3QtcHJvZmlsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTRweDtcbiAgbWluLXdpZHRoOiAyNTBweDtcbn1cblxuLnByb2R1Y3QtbWVkaWEge1xuICB3aWR0aDogNDhweDtcbiAgaGVpZ2h0OiA0OHB4O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGJhY2tncm91bmQ6ICMwNzBjMDg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICRib3JkZXI7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4LXNocmluazogMDtcblxuICBpbWcge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgfVxuXG4gIC5tZWRpYS1mYWxsYmFjayB7XG4gICAgZm9udC1zaXplOiAxLjI1cmVtO1xuICAgIG9wYWNpdHk6IDAuNztcbiAgfVxufVxuXG4ucHJvZHVjdC1pbmZvIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAycHg7XG59XG5cbi5wcm9kdWN0LXRpdGxlIHtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICR3aGl0ZTtcbiAgZm9udC1zaXplOiAwLjkycmVtO1xuICBsaW5lLWhlaWdodDogMS4yNTtcbn1cblxuLnByb2R1Y3Qtc2x1ZyB7XG4gIGZvbnQtc2l6ZTogMC43NHJlbTtcbiAgY29sb3I6ICRtdXRlZDtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcbn1cblxuLnByb2R1Y3QtbWF0ZXJpYWwge1xuICBmb250LXNpemU6IDAuNzJyZW07XG4gIGNvbG9yOiAkbmVvbjtcbiAgb3BhY2l0eTogMC44NTtcblxuICAubWF0ZXJpYWwtbGFiZWwge1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIEJhZGdlcyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5iYWRnZSB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAzcHggOHB4O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGZvbnQtc2l6ZTogMC43NHJlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG5cbiAgJi0tY2F0ZWdvcnkge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAxODMsIDMsIDAuMSk7XG4gICAgY29sb3I6ICRnb2xkO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAxODMsIDMsIDAuMjgpO1xuICB9XG5cbiAgJi0tc3RhdHVzIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgZm9udC1zaXplOiAwLjdyZW07XG4gIH1cblxuICAmLS1hY3RpdmUge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoNTcsIDI1NSwgMjAsIDAuMTIpO1xuICAgIGNvbG9yOiAkbmVvbjtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAyNTUsIDIwLCAwLjM1KTtcbiAgfVxuXG4gICYtLWluYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE0KTtcbiAgfVxuXG4gICYtLWZlYXR1cmVkIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMTgzLCAzLCAwLjE2KTtcbiAgICBjb2xvcjogJGdvbGQ7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDE4MywgMywgMC40KTtcbiAgICBmb250LXNpemU6IDAuNjhyZW07XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgfVxufVxuXG4uc3RhdHVzLXN0YWNrIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiA1cHg7XG5cbiAgJi5mbGV4LXJvdyB7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gIH1cbn1cblxuLy8gw6LClMKAw6LClMKAw6LClMKAIFByaWNlICYgU3RvY2sgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4ucHJpY2Utc3RhY2sge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDFweDtcblxuICAucHJpY2UtY3VycmVudCB7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJG5lb247XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICB9XG5cbiAgLnByaWNlLWNvbXBhcmUge1xuICAgIGZvbnQtc2l6ZTogMC43NHJlbTtcbiAgICBjb2xvcjogJG11dGVkO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbGluZS10aHJvdWdoO1xuICB9XG59XG5cbi5zdG9jay12YWx1ZSB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAkd2hpdGU7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xuXG4gICYtLXplcm8ge1xuICAgIGNvbG9yOiAjZmY2YjZiO1xuICB9XG5cbiAgJi0tbm9uZSB7XG4gICAgY29sb3I6ICRtdXRlZC1kYXJrO1xuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xuICB9XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBBY3Rpb25zIChEZXNrdG9wIHRleHQgYnV0dG9uczogRWRpdCB8IERlbGV0ZSkgw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAw6LClMKAXG4uYWN0aW9uLWJ1dHRvbnMge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiA4cHg7XG59XG5cbi5idG4tbGluayB7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgcGFkZGluZzogMnB4IDRweDtcbiAgZm9udC1zaXplOiAwLjg1cmVtO1xuICBmb250LXdlaWdodDogNjAwO1xuICBjdXJzb3I6IHBvaW50ZXIgIWltcG9ydGFudDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMThzIGVhc2U7XG5cbiAgJi0tZWRpdCB7XG4gICAgY29sb3I6ICRuZW9uO1xuICAgICY6aG92ZXIge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICBjb2xvcjogbGlnaHRlbigkbmVvbiwgMTAlKTtcbiAgICB9XG4gIH1cblxuICAmLS1kZWxldGUge1xuICAgIGNvbG9yOiAkcmVkO1xuICAgICY6aG92ZXIge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICBjb2xvcjogbGlnaHRlbigkcmVkLCAxMCUpO1xuICAgIH1cbiAgfVxufVxuXG4uYWN0aW9uLWRpdmlkZXIge1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE4KTtcbiAgZm9udC1zaXplOiAwLjhyZW07XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBNb2JpbGUgQ2FyZHMgVmlldyAoPD0gODYwcHgpIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuLm1vYmlsZS1wcm9kdWN0cy1ncmlkIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgcGFkZGluZzogMTZweDtcbiAgZ2FwOiAxNHB4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA4NjBweCkge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gIH1cbn1cblxuLnByb2R1Y3QtbW9iaWxlLWNhcmQge1xuICBiYWNrZ3JvdW5kOiAjMDkxMTBhO1xuICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMTRweDtcblxuICAuY2FyZC1oZWFkZXItcm93IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGdhcDogMTJweDtcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgfVxuXG4gIC5jYXJkLW1ldGEge1xuICAgIGZsZXg6IDE7XG5cbiAgICAucHJvZHVjdC10aXRsZSB7XG4gICAgICBmb250LXNpemU6IDFyZW07XG4gICAgICBtYXJnaW4tYm90dG9tOiAycHg7XG4gICAgfVxuICB9XG5cbiAgLmNhcmQtZGV0YWlscy1ncmlkIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XG4gICAgZ2FwOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yNSk7XG4gICAgcGFkZGluZzogMTBweCAxMnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDQpO1xuICB9XG5cbiAgLmRldGFpbC1pdGVtIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAycHg7XG4gIH1cblxuICAuZGV0YWlsLWxhYmVsIHtcbiAgICBmb250LXNpemU6IDAuNjhyZW07XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gIH1cblxuICAucHJvZHVjdC1tYXRlcmlhbC10ZXh0IHtcbiAgICBmb250LXNpemU6IDAuNzhyZW07XG4gICAgY29sb3I6ICRuZW9uO1xuICB9XG5cbiAgLmNhcmQtYWN0aW9ucy1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZ2FwOiAxMHB4O1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgcGFkZGluZy10b3A6IDRweDtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRW1wdHkgJiBFcnJvciBTdGF0ZSBDYXJkcyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5lbXB0eS1zdGF0ZS1jYXJkLFxuLnN0YXR1cy1jYXJkIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nOiA1NnB4IDI0cHg7XG5cbiAgLmVtcHR5LWdseXBoLFxuICAuc3RhdHVzLWdseXBoIHtcbiAgICBmb250LXNpemU6IDNyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgfVxuXG4gIC5lbXB0eS10aXRsZSxcbiAgLnN0YXR1cy10aXRsZSB7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgbGV0dGVyLXNwYWNpbmc6IDEuNXB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY29sb3I6ICR3aGl0ZTtcbiAgICBtYXJnaW4tYm90dG9tOiA2cHg7XG4gIH1cblxuICAuZW1wdHktc3VidGl0bGUsXG4gIC5zdGF0dXMtZGVzYyB7XG4gICAgY29sb3I6ICRtdXRlZDtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgICBtYXgtd2lkdGg6IDQ0MHB4O1xuICAgIG1hcmdpbjogMCBhdXRvIDIwcHg7XG4gICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgfVxuXG4gIC5lbXB0eS1hY3Rpb25zIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGdhcDogMTJweDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gIH1cbn1cblxuLnN0YXR1cy1jYXJkLS1lcnJvciB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCA1OSwgNTksIDAuMDUpO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgNTksIDU5LCAwLjIpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuXG4gIC5zdGF0dXMtdGl0bGUge1xuICAgIGNvbG9yOiAjZmY2YjZiO1xuICB9XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBMb2FkaW5nIFNrZWxldG9ucyDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5sb2FkaW5nLXN0YXRlLWNhcmQge1xuICBiYWNrZ3JvdW5kOiAkYmctY2FyZDtcbiAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlcjtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgcGFkZGluZzogMjRweDtcbiAgbWFyZ2luLWJvdHRvbTogMjRweDtcblxuICAubG9hZGluZy1oZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICBwYWRkaW5nLWJvdHRvbTogMTRweDtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJGJvcmRlci1kaW07XG4gIH1cblxuICAubG9hZGluZy1zcGlubmVyIHtcbiAgICB3aWR0aDogMjBweDtcbiAgICBoZWlnaHQ6IDIwcHg7XG4gICAgYm9yZGVyOiAycHggc29saWQgcmdiYSg1NywgMjU1LCAyMCwgMC4yKTtcbiAgICBib3JkZXItdG9wLWNvbG9yOiAkbmVvbjtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYW5pbWF0aW9uOiBzcGluIDAuOHMgbGluZWFyIGluZmluaXRlO1xuICB9XG5cbiAgLmxvYWRpbmctdGV4dCB7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgZm9udC1zaXplOiAwLjkycmVtO1xuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBjb2xvcjogJG5lb247XG4gICAgbWFyZ2luOiAwO1xuICB9XG59XG5cbi5za2VsZXRvbi10YWJsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMTJweDtcbn1cblxuLnNrZWxldG9uLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTZweDtcbiAgcGFkZGluZzogMTJweCAxNHB4O1xuICBiYWNrZ3JvdW5kOiAjMDgwZjA5O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMyk7XG59XG5cbi5za2VsZXRvbi1jZWxsIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgIDkwZGVnLFxuICAgIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykgMjUlLFxuICAgIHJnYmEoNTcsIDI1NSwgMjAsIDAuMDYpIDUwJSxcbiAgICByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIDc1JVxuICApO1xuICBiYWNrZ3JvdW5kLXNpemU6IDIwMCUgMTAwJTtcbiAgYW5pbWF0aW9uOiBzaGltbWVyIDEuNXMgaW5maW5pdGU7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbn1cblxuLnNrZWxldG9uLXRodW1iIHtcbiAgd2lkdGg6IDQ0cHg7XG4gIGhlaWdodDogNDRweDtcbiAgZmxleC1zaHJpbms6IDA7XG59XG5cbi5za2VsZXRvbi1tZXRhIHtcbiAgZmxleDogMTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiA2cHg7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG5cbiAgLnNrZWxldG9uLWxpbmUge1xuICAgIGhlaWdodDogMTJweDtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgICAgOTBkZWcsXG4gICAgICByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIDI1JSxcbiAgICAgIHJnYmEoNTcsIDI1NSwgMjAsIDAuMDYpIDUwJSxcbiAgICAgIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykgNzUlXG4gICAgKTtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMCUgMTAwJTtcbiAgICBhbmltYXRpb246IHNoaW1tZXIgMS41cyBpbmZpbml0ZTtcblxuICAgICYudy02MCB7IHdpZHRoOiA2MCU7IH1cbiAgICAmLnctMzAgeyB3aWR0aDogMzAlOyB9XG4gIH1cbn1cblxuLnNrZWxldG9uLXBpbGwge1xuICB3aWR0aDogOTBweDtcbiAgaGVpZ2h0OiAyMnB4O1xufVxuXG4uc2tlbGV0b24tcHJpY2Uge1xuICB3aWR0aDogNjBweDtcbiAgaGVpZ2h0OiAxOHB4O1xufVxuXG4uc2tlbGV0b24tc3RvY2sge1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiAxOHB4O1xufVxuXG4uc2tlbGV0b24tYWN0aW9ucyB7XG4gIHdpZHRoOiA5MHB4O1xuICBoZWlnaHQ6IDIwcHg7XG59XG5cbi8vIMOiwpTCgMOiwpTCgMOiwpTCgCBQYWdpbmF0aW9uIEZvb3RlciDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5wYWdpbmF0aW9uLWZvb3RlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgcGFkZGluZzogMTZweCAyMHB4O1xuICBib3JkZXItdG9wOiAxcHggc29saWQgJGJvcmRlcjtcbiAgYmFja2dyb3VuZDogIzA4MGQwOTtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDE0cHg7XG5cbiAgLnBhZ2luYXRpb24tc3VtbWFyeSB7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gIH1cblxuICAucGFnaW5hdGlvbi1uYXYge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDZweDtcbiAgfVxuXG4gIC5wYWdlLW51bWJlcnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDRweDtcbiAgfVxuXG4gIC5wYWdpbmF0aW9uLWJ0bixcbiAgLnBhZ2luYXRpb24tcGFnZS1idG4ge1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcbiAgICBjb2xvcjogJHdoaXRlO1xuICAgIGZvbnQtZmFtaWx5OiAkZm9udC1kaXNwO1xuICAgIGZvbnQtc2l6ZTogMC44NHJlbTtcbiAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgcGFkZGluZzogNnB4IDEycHg7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGN1cnNvcjogcG9pbnRlciAhaW1wb3J0YW50O1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE4cyBlYXNlO1xuXG4gICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICBib3JkZXItY29sb3I6ICRuZW9uO1xuICAgICAgY29sb3I6ICRuZW9uO1xuICAgICAgYmFja2dyb3VuZDogJG5lb24tZGltO1xuICAgIH1cblxuICAgICY6ZGlzYWJsZWQge1xuICAgICAgb3BhY2l0eTogMC4zNTtcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmLmlzLWFjdGl2ZSB7XG4gICAgICBiYWNrZ3JvdW5kOiAkbmVvbjtcbiAgICAgIGNvbG9yOiAjMDAwO1xuICAgICAgYm9yZGVyLWNvbG9yOiAkbmVvbjtcbiAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMTBweCAkbmVvbi1nbG93O1xuICAgIH1cbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgRGVsZXRlIENvbmZpcm1hdGlvbiBNb2RhbCDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcbi5tb2RhbC1vdmVybGF5IHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBpbnNldDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjgpO1xuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcbiAgei1pbmRleDogMTAwMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGFuaW1hdGlvbjogZmFkZUluIDAuMnMgZWFzZTtcbn1cblxuLm1vZGFsLWRpYWxvZyB7XG4gIGJhY2tncm91bmQ6ICMwZTE4MTA7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCA1OSwgNTksIDAuMzUpO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICB3aWR0aDogMTAwJTtcbiAgbWF4LXdpZHRoOiA0ODBweDtcbiAgYm94LXNoYWRvdzogMCAxMnB4IDQwcHggcmdiYSgwLCAwLCAwLCAwLjcpO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBhbmltYXRpb246IHNjYWxlVXAgMC4yMnMgY3ViaWMtYmV6aWVyKDAuMTYsIDEsIDAuMywgMSk7XG5cbiAgLm1vZGFsLWhlYWRlciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBwYWRkaW5nOiAxNnB4IDIwcHg7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XG4gICAgYmFja2dyb3VuZDogIzA4MGQwOTtcbiAgfVxuXG4gIC5tb2RhbC10aXRsZSB7XG4gICAgZm9udC1mYW1pbHk6ICRmb250LWRpc3A7XG4gICAgZm9udC1zaXplOiAxLjE1cmVtO1xuICAgIGxldHRlci1zcGFjaW5nOiAxLjVweDtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIG1hcmdpbjogMDtcblxuICAgICYtLWRhbmdlciB7XG4gICAgICBjb2xvcjogI2ZmNmI2YjtcbiAgICB9XG4gIH1cblxuICAubW9kYWwtY2xvc2UtYnRuIHtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjb2xvcjogJG11dGVkO1xuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xuICAgIGN1cnNvcjogcG9pbnRlciAhaW1wb3J0YW50O1xuICAgIHBhZGRpbmc6IDRweDtcblxuICAgICY6aG92ZXIge1xuICAgICAgY29sb3I6ICR3aGl0ZTtcbiAgICB9XG4gIH1cblxuICAubW9kYWwtYm9keSB7XG4gICAgcGFkZGluZzogMjRweCAyMHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxuXG4gIC5kZWxldGUtaWNvbi13cmFwIHtcbiAgICBmb250LXNpemU6IDIuNHJlbTtcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICB9XG5cbiAgLmRlbGV0ZS1jb25maXJtLXRleHQge1xuICAgIGZvbnQtc2l6ZTogMS4wNXJlbTtcbiAgICBjb2xvcjogJHdoaXRlO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICB9XG5cbiAgLnRhcmdldC1wcm9kdWN0LW5hbWUge1xuICAgIGZvbnQtc2l6ZTogMS4xNXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkbmVvbjtcbiAgICBmb250LWZhbWlseTogJGZvbnQtZGlzcDtcbiAgICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICAgIG1hcmdpbi1ib3R0b206IDE0cHg7XG4gICAgd29yZC1icmVhazogYnJlYWstd29yZDtcbiAgfVxuXG4gIC5kZWxldGUtZGlzY2xhaW1lciB7XG4gICAgZm9udC1zaXplOiAwLjc4cmVtO1xuICAgIGNvbG9yOiAkbXV0ZWQ7XG4gICAgbGluZS1oZWlnaHQ6IDEuNDU7XG4gIH1cblxuICAubW9kYWwtZm9vdGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgZ2FwOiAxMnB4O1xuICAgIHBhZGRpbmc6IDE2cHggMjBweDtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcbiAgICBiYWNrZ3JvdW5kOiAjMDgwZDA5O1xuICB9XG5cbiAgLmJ0bi1zcGlubmVyIHtcbiAgICB3aWR0aDogMTRweDtcbiAgICBoZWlnaHQ6IDE0cHg7XG4gICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpO1xuICAgIGJvcmRlci10b3AtY29sb3I6ICNmZmY7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBhbmltYXRpb246IHNwaW4gMC43cyBsaW5lYXIgaW5maW5pdGU7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgfVxufVxuXG4vLyDDosKUwoDDosKUwoDDosKUwoAgVXRpbGl0eSBBbmltYXRpb25zIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuQGtleWZyYW1lcyBzcGluIHtcbiAgZnJvbSB7IHRyYW5zZm9ybTogcm90YXRlKDBkZWcpOyB9XG4gIHRvIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfVxufVxuXG5Aa2V5ZnJhbWVzIHNoaW1tZXIge1xuICAwJSB7IGJhY2tncm91bmQtcG9zaXRpb246IC0yMDAlIDA7IH1cbiAgMTAwJSB7IGJhY2tncm91bmQtcG9zaXRpb246IDIwMCUgMDsgfVxufVxuXG5Aa2V5ZnJhbWVzIGZhZGVJbiB7XG4gIGZyb20geyBvcGFjaXR5OiAwOyB9XG4gIHRvIHsgb3BhY2l0eTogMTsgfVxufVxuXG5Aa2V5ZnJhbWVzIHNjYWxlVXAge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gIH1cbiAgdG8ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxufVxuXG4ubXQtNCAgeyBtYXJnaW4tdG9wOiA0cHg7IH1cbi5tdC0xMiB7IG1hcmdpbi10b3A6IDEycHg7IH1cbi5tdC0xNiB7IG1hcmdpbi10b3A6IDE2cHg7IH1cbi5tbC0xMiB7IG1hcmdpbi1sZWZ0OiAxMnB4OyB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 971:
/*!*********************************************************!*\
  !*** ./src/app/admin/services/admin-product.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminProductService: () => (/* binding */ AdminProductService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 7919);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ 1318);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7580);






class AdminProductService {
  constructor(http) {
    this.http = http;
    this.base = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
  }
  // ─── Categories ───────────────────────────────────────────────
  getCategories() {
    return this.http.get(`${this.base}/categories`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  createCategory(payload) {
    return this.http.post(`${this.base}/categories`, payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  updateCategory(id, payload) {
    return this.http.patch(`${this.base}/categories/${id}`, payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  deleteCategory(id) {
    return this.http.delete(`${this.base}/categories/${id}`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  // ─── Products ─────────────────────────────────────────────────
  getProducts(pageOrParams = 1, pageSize = 20, categoryId, search, isFeatured) {
    let page = 1;
    let size = pageSize;
    let catId = categoryId;
    let query = search;
    let feat = isFeatured;
    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      page = pageOrParams.page ?? 1;
      size = pageOrParams.pageSize ?? 20;
      catId = pageOrParams.categoryId;
      query = pageOrParams.search;
      feat = pageOrParams.isFeatured;
    } else if (typeof pageOrParams === 'number') {
      page = pageOrParams;
    }
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('page', page.toString()).set('page_size', size.toString());
    if (catId && catId.trim() !== '') {
      params = params.set('category_id', catId.trim());
    }
    if (query && query.trim() !== '') {
      params = params.set('search', query.trim());
    }
    if (feat !== undefined && feat !== null) {
      params = params.set('is_featured', feat.toString());
    }
    return this.http.get(`${this.base}/products`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  getProductById(id) {
    return this.http.get(`${this.base}/products/${id}`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  createProduct(payload) {
    return this.http.post(`${this.base}/products`, payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  updateProduct(id, payload) {
    return this.http.patch(`${this.base}/products/${id}`, payload).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  deleteProduct(id) {
    return this.http.delete(`${this.base}/products/${id}`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  // ─── Error handler ────────────────────────────────────────────
  handleError(error) {
    let msg = 'An unexpected error occurred.';
    if (error.status === 0) msg = 'Cannot reach the server. Is the backend running?';else if (error.status === 400) msg = 'Bad request — please check your input.';else if (error.status === 404) msg = 'Resource not found.';else if (error.status === 409) msg = error.error?.error?.message || 'Conflict — slug or SKU may already exist.';else if (error.status === 422) msg = 'Validation error — please check all required fields.';else if (error.status >= 500) msg = 'Server error. Please try again later.';
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.throwError)(() => new Error(msg));
  }
  static {
    this.ɵfac = function AdminProductService_Factory(t) {
      return new (t || AdminProductService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: AdminProductService,
      factory: AdminProductService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_admin_admin_module_ts.js.map