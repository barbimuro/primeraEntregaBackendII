import CartManager from "./mongo/cartManager.js";
import ProductsManager from "./mongo/productsManager.js";
import UserManager from "./mongo/UserManager.js";

export const cartsService = new CartManager();
export const productsService = new ProductsManager();
export const usersService = new UserManager();
