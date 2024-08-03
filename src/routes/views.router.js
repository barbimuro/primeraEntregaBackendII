import express from 'express';
import { Router } from 'express';
import { productsService } from '../managers/index.js';
import passport from 'passport';

const router = Router();
/*
router.get('/',async (req,res) =>{
    const products = await productsService.loadProducts();
    res.render('home',{
        products
    });
})

router.get('/realtimeproducts', (req,res) =>{
    res.render('realTimeProducts');
})

router.get('/:id',async (req,res) =>{
    const pid = req.params.id;
    const product = await productsService.getProductById(pid);
    res.render('productsDetail',{
        product
    })
})

*/
router.get('/',(req,res)=>{
    res.render('Home');
})

router.get('/register',(req,res)=>{
    res.render('Register');
})

router.get('/login',(req,res)=>{
    res.render('Login');
})

router.get('/profile',passport.authenticate('current',{session:false}),(req,res)=>{
    console.log(req.user);
    res.render('Profile')
})





export default router;