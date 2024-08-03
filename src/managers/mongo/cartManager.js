import Cart from '../mongo/models/cart.model.js';

class CartManager {
    async loadCarts() {
        return await Cart.find().populate('productsInCart.product');
    }

    async saveCart(cartData) {
        const newCart = new Cart(cartData);
        return await newCart.save();
    }

    async updateCart(id, updatedData) {
        return await Cart.findByIdAndUpdate(id, updatedData, { new: true }).populate('productsInCart.product');
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.productsInCart = cart.productsInCart.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        cart.productsInCart = [];
        return await cart.save();
    }
     async getNextId() {
        const carts = await this.loadCarts();
        if (carts.length === 0) return 1;
        return carts[carts.length - 1].id + 1;
    }
}

export default CartManager;

   
