import mongoose from 'mongoose';

const collection = "Product";

const productSchema = new mongoose.Schema({
    name: String,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String
});

const Product = mongoose.model(collection, productSchema);
export default Product;
