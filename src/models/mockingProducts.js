import {faker} from '@faker-js/faker';

const modelProduct = ()=>{
    return {
        _id_prod:faker.database.mongodbObjectId(),
        title:faker.commerce.product() ,
        description:faker.commerce.productDescription(),
        price:faker.commerce.price(),
        stock:faker.number.int(),
        category:faker.commerce.department(),
        status:faker.datatype.boolean(),
        code:faker.commerce.isbn(),
        thumbnail:faker.image.urlLoremFlickr()
    }
}
const createProducts = (cant)=>{
    const products = [];
    for (let i = 0; i < cant; i++) {
        products.push(modelProduct());
    }
    return products;
}

export default createProducts;