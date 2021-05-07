function Product (name, price){
	this.name = name;
	this.price = price;
};

let Basket = {
	products : [
		//{name: 'water', price: 100},
		//{name: 'bread', price: 120},
	],

	init(){
		const buttons = document.getElementsByClassName('product__add');
		for(element of buttons){
			element.addEventListener('click', (event)=>{
				const parent = event.target.parentElement;
				const name = parent.querySelector('.product__name').innerHTML;
				const price = parent.querySelector('.product__price').innerHTML;

				this.addProduct(name, price);
				console.log(this.products);
				this.render();
			});
		};
	},
	
	addProduct(name, price){
		for (item of this.products){
			if (name === item.name && price === item.price){
				item.count++;
				return;
			};
		};
		this.products.push({name:name, price:price, count:1});
	},
	
	render(){
		const basket = document.querySelector('.basket');
		basket.innerHTML='';
		
		for (item of this.products){
			const {name, price, count} = item;
			const div = document.createElement('div');
			div.classList.add('product__item');
			
			const name_product = document.createElement('p');
			name_product.innerHTML = name;
			
			const price_product = document.createElement('p');
			price_product.innerHTML = price;

			const count_product = document.createElement('p');
			count_product.innerHTML = count;
			
			div.append(name_product);
			div.append(price_product);
			div.append(count_product);
			basket.append(div);
		};
	},
};
let obj = Basket;
obj.init();
