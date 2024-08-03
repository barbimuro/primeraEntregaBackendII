import { Router } from "express";
import fileSystem from "fs";
import CartManager from "../managers/mongo/cartManager.js";
import ProductsManager from "../managers/mongo/productsManager.js";

const productsPath = "src/files/products.json"
const cartPath = "src/files/carts.json";
const router = Router();
const cartManager = new CartManager();
const productsManager = new ProductsManager()

/*const loadProducts = () => {
    if (fileSystem.existsSync(PATH)) {
        const data = fileSystem.readFileSync('./products.json', 'utf-8');
        return JSON.parse(data);
    } else {
        return [
            { "id": 1, "name": "spray fijador", "quantity": 7, "price": 20 },
            { "id": 2, "name": "Paleta de sombras", "quantity": 5, "price": 70 },
            { "id": 3, "name": "Base", "quantity": 3, "price": 50 },
            { "id": 4, "name": "Mascara", "quantity": 21, "price": 15 }
        ];
    }
} */

router.post('/', async (req, res) => {
    const carts = await cartManager.loadCarts();
    const newCartId = await cartManager.getNextId();
    const newCart = {
        id: newCartId,
        productsInCart: []
    };
    carts.push(newCart);
    await cartManager.saveCarts(carts);
    res.status(201).send(newCart);
});


router.get('/:cid', async (req, res) => {
    const carts = await cartManager.loadCarts();
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).send({ status: "error", error: "cart not found" });
    }
    res.send(cart.productsInCart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await cartManager.loadCarts();
    const products = await productsManager.loadProducts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).send({ status: "error", error: "cart not found" });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).send({ status: "error", error: "product not found" });
    }

    const existingProductInCart = cart.productsInCart.find(p => p.product === productId);
    if (existingProductInCart) {
        existingProductInCart.quantity += 1;
    } else {
        cart.productsInCart.push({ product: productId, quantity: 1 });
    }

    await cartManager.saveCarts(carts);
    res.status(201).send(cart);
});

export default router;