import mongoose from 'mongoose';

const collection = "Cart";

const cartSchema = new mongoose.Schema({
    productsInCart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        }
    ]
});

const Cart = mongoose.model(collection, cartSchema);
export default Cart;