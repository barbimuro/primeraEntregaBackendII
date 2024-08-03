import { Router }  from "express";
import uploader from "../middlewares/uploader.js";
import ProductsManager from "../managers/mongo/productsManager.js";
const router = Router();
const PATH = "src/files/products.json";
const productsManager = new ProductsManager()

router.get('/', async (req, res) => {
  const products = await productsManager.loadProducts();
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
  } else {
      res.json(products);
  }
});
router.get('/:pid', async (req, res)=>{
  const products = await productsManager.loadProducts();
    const pid = req.params.pid;
    const productId = parseInt(pid);
    const product = products.find(p=>p.id === productId)
    if(!product){
        return res.status(404).send({status:"error", error:"product not found"})
    }
      

    res.send(product);
})

router.post('/',uploader.single('data'), async (req,res)=>{
  try {
  const products = await productsManager.loadProducts();
  const newProduct = ({
    name:req.body.name,
    title:req.body.title,
    description:req.body.description,
    code:req.body.code,
    price:parseInt(req.body.price),
    status:req.body.status === 'true' || req.body.status === '1',
    stock:parseInt(req.body.stock),
    category:req.body.category
  })
  products.push(newProduct);
  await productsManager.saveProducts(products);

  res.send("Producto agregado");
  console.log(products);
} catch (error) {
  res.status(500).send({ status: "error", error: error.message });
}
});

 router.put('/:pid', uploader.single('data'),async (req, res)=>{
  const products = await productsManager.loadProducts();
  const pid = req.params.pid;
  const productId = parseInt(pid);
  const productIndex = products.findIndex(p=>p.id === productId)
  if(productIndex === -1){
      return res.status(404).send({status:"error", error:"product not found"})
  }
  products[productIndex] = {
    ...products[productIndex],
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: parseInt(req.body.price),
    status: req.body.status === 'true' || req.body.status === '1',
    stock: parseInt(req.body.stock),
    category: req.body.category
  };

  await productsManager.saveProducts(products);

  res.send(products[productIndex]);
 
})

  router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const productId = parseInt(pid);
  const deleted = await productsManager.deleteProductById(productId);
  if (deleted) {
    res.send({ status: "success", message: "Producto eliminado correctamente" });
  } else {
    res.status(404).send({ status: "error", error: "product not found" });
  }
});



export default router