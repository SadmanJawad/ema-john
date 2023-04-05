import React, { useEffect, useState } from "react";
import { addToDb, getShoppingCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    // console.log("products", products);
    const storedCart = getShoppingCart();
    const savedCart = [];

// step 1 : get id of the storedCart
    for (const id in storedCart) {
// step :2 get product from products state by using id
      const addedProduct = products.find((product) => product.id === id);
      if (addedProduct) {
//   step : 3 get quantity of the product
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
// step : 4 add the addedProduct to the savedCart
        savedCart.push(addedProduct);
        console.log(addedProduct);
      }
      // console.log("added prod", addedProduct);
    }
// step : 5 set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product);
    // const newCart = [...cart, product];

// *hard technique of ( Cart.jsx :17)
    // if product doesn't exist in the cart , then set quantity = 1, if exist update quantity by 1
    let newCart = [];
    const exists = cart.find(pd => pd.id === product.id);
    if (!exists){
      product.quantity = 1 ;
      newCart = [...cart, product]
    }
    else{
      exists.quantity = exists.quantity +1 ;
      const remaining = cart.filter(pd => pd.id !== product.id);
      newCart = [...remaining, exists]
    }

    setCart(newCart);
//! add cart data to LocalStorage (51-4)
    addToDb(product.id);
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart}></Cart>
      </div>
    </div>
  );
};

export default Shop;
