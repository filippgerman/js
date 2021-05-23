"use strict"

const baseUrl = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const catalogData = '/catalogData.json';
const getBasket ='/getBasket.json';
const addToBasket = '/addToBasket.json';

class serverInteraction{
	/**
	  Содержит основные функции взаимодействия с сервером.
	  */
	async getData (url){
		/**
		   При успешном выполнении возвращает массив объектов (товаров).
		   @param {url} бэк.
		   @ return распарсенный json.
		*/
		let response = await fetch(url);
		if (response.status == 200){
			return response.json();	
		}else{
			throw new Error("Error");
		};
	};
}

class GoodsFactory{
	createPriice(price){
		/**
		  Создает параграф цены.
		  @param price цена товара.
		  @retuen параграф цены. 
		*/
		const productPrice = document.createElement('p');
		productPrice.innerHTML = price;
		productPrice.classList.add('product-cart__price');
		return productPrice;
	};

	createName(name){
		/**
		   Создает параграф имени.
		   @param наименование параметра.
		   @retuen параграф имени. 
		*/
		const productName = document.createElement('p');
		productName.innerHTML = name;
		productName.classList.add('product-cart__name');
		return productName;
	};

	createButton(buttonClass, buttonLable){
		const button = document.createElement('button');
		button.classList.add(buttonClass);
		button.innerHTML = buttonLable;
		return button;
	};

	createButtonAddProduct(basket){
		/**
		  Создает кноку на карточке товара
		  @retuen кнопка
		*/
		const button = this.createButton('product__add', 'go');
		button.addEventListener('click', (event)=>basket.triggerEvent());
		return button;
	};

	createButtonDelProduct(basket){
		/**
		  Создает кноку удаления на карточке товара в корзине
		  @return кнопка удаления товара 
		*/
		const button = this. createButton('product__add','del');
		button.addEventListener('click', (event)=>basket.triggerEvent(false));
	};
}

class Goods extends serverInteraction{
	/**
	  получает данные с бэка и создает карточки товаров на странице.
	  */
	constructor(basket){
		super(basket);
		this.basket = basket;
		this.goodsFactory = new GoodsFactory();
			
		try{
			this.getData(`${baseUrl}${catalogData}`)
			.then(result => {
				result.forEach(item => this.renderGoods(item));
			});
		}catch(err){
			console.log(err);
		};
	};
	
	renderGoods(goods){
		/**
		   Генерирует каталог товаров.
		   @param {goods} объект с информацией о товаре.
		*/
		const {price, product_name: name} = goods;
		const divGoods = document.querySelector('.goods');
		const product = document.createElement('div');
		product.classList.add('product-cart');

		product.append(this.goodsFactory.createName(name),
					   this.goodsFactory.createPriice(price),
					   this.goodsFactory.createButtonAddProduct(this.basket));
		divGoods.append(product);
	};
};

class Basket{
	constructor(){
		this.amountPurchases = 0;
		this.listProducts = [];
		this.goodsFactory = new GoodsFactory();
	};
	
	triggerEvent(eventAdd = true){
		/**
		  Запуск события при нажатии на кнопку.
		*/
		const parent = event.target.parentElement;
		const name = parent.querySelector('.product-cart__name').innerHTML;
		const price = parent.querySelector('.product-cart__price').innerHTML;

		if (eventAdd){
			this.addProduct(name, price);	
		}else{
			this.delPoduct(name, price);
		};
		
		this.calculateCost(price);
		this.render();
	};

	addProduct(name, price){
		/**
		   Добавляет продукт в корзину.
		   @param name название продукта.
		   @param price цена продукта.
		*/
		
		for(let item = this.listProducts, i = 0; i < item.length; i++){
			if (item[i].name === name && item[i].price === price){
				item[i].count++;
				return;
			};
		};
		this.listProducts.push({name:name, price:price, count:1});
	};

	delPoduct(name, price){
		/**
		  Удаяет продукт в корзине.
		  @param name название продукта.
		  @param price цена продукта.
		*/
		console.log('удаление товара');
		//console.log(this.listProducts);
		for(let item = this.listProducts, i = 0; i < item.length; i++){
			if (item[i].name === name && item[i].price === price){
				item[i].count--;
				if (item[i].count === 0){
					item.splice(i,1);
				};
				return;
			};
		};
	};
	
	calculateCost(price){
		/**
		  Расчитывает суммарную стоимость всех товаров в корзине.
		  @param сумма товара в корзине.
		*/
		this.amountPurchases = 0;
		if (this.listProducts.length === 0){
			this.amountPurchases = +price;
		}else{
			for(let item = this.listProducts, i = 0; i < item.length; i++){
				this.amountPurchases += +item[i].price * +item[i].count;
			};
		};
	};
	
	render(){
		/**
		  Прорисовка продуктов корзины.
		*/
		const basket = document.querySelector('.basket__content');
		basket.innerHTML = '';

		const divAmountPurchases = document.createElement('div');
		divAmountPurchases.innerHTML = this.amountPurchases;
		divAmountPurchases.classList.add('basket__sum');
		
		for(let item = this.listProducts, i = 0; i < item.length; i++){
			const {name, price, count} = item[i];
			const div = document.createElement('div');
			div.classList.add('product-cart');
			
			const count_product = document.createElement('p');
			count_product.innerHTML = count;

			const button = document.createElement('button');
			button.classList.add('product_del');
			button.innerHTML = 'del';
			button.addEventListener('click', (event)=>this.triggerEvent(false));
			
			div.append(this.goodsFactory.createName(name),
					   this.goodsFactory.createPriice(price),
					   button,
					   count_product);
			
			basket.append(div,
						 divAmountPurchases);
		};
	};
};
	
async function init(){
	let basket = await new Basket;
	let goods = await new Goods(basket);
};

init();
