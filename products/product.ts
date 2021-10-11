'use strict';

import { success, notAllowed ,failure , customResponse} from '../src/libs/response-lib';
import { SQLConnection, dbConnect ,Sequelize} from '../src/libs/mysql-lib';
import { Installment, Product } from '../src/models';
export async function get(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  try {
    await dbConnect();
    const products = await Product.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    })
    return callback(null, success(products));
  } catch ({ message }) {
    console.log(message);
    return callback(null, notAllowed({ status: false, message }));
  }
}

export async function createproduct(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  const { price,name,sku,description } = JSON.parse(event.body || {});
  try {
    await SQLConnection.authenticate();
  } catch (e) {
    console.log(e);
    return callback(null, notAllowed({ status: false, error: 'Ocurrió un error' }));
  }
  try {
    if(!price)
      return callback(null,failure({status:false,error:'Se necesita un precio'}))

    if(!name)
      return callback(null,failure({status:false,error:'Se necesita un nombre del producto'}))
    
    if(!sku)
      return callback(null,failure({status:false,error:'Se necesita un sku del producto'}))

    if(!description)
      return callback(null,failure({status:false,error:'Se necesita una descripcion del producto'}))

    await Product.create({name,price,sku,description})

    return callback(null, success({ status: 'Producto creado con éxito' }));
  }catch({message}){
    console.log(message);
    return callback(null, notAllowed({ status: false, message }));
  }
}
export async function updateProduct(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event)
  const {product} = JSON.parse(event.body || {});
  try {
      await SQLConnection.authenticate();
  } catch (e) {
      console.log(e);
      return callback(
          null,
          notAllowed({status: false, error: 'Ocurrió un error'})
      );
  }
  try {
    const productFromDb = await Product.findById(product.id);
    if(!productFromDb)
      throw 'Invalid product'
    delete product.id
    await Product.update(product,{where:{id:productFromDb.id}})
    return callback(null, success({status: 'Product Updated'}));
  } catch (error) {
      return callback(null, notAllowed({status: false, error}));
  }
}

export async function erase(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  const { productId } = event.pathParameters;
  try {
    await dbConnect();

    const product = await Product.findOne({
      where: {
        id: productId,
      }})
    if (!product)
      return callback(null, customResponse(401, {
        message: 'No se encontró el producto',
      }));

    await product.destroy();
    callback(null, customResponse(200, { message: 'Producto eliminado' }));
  } catch ({ message }) {
    callback(null, customResponse(500, { message }));
  }
}

export async function createInstallment(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  const { description,punctual_rate,normal_rate ,weeks} = JSON.parse(event.body || {});
  try {
    await SQLConnection.authenticate();
  } catch (e) {
    console.log(e);
    return callback(null, notAllowed({ status: false, error: 'Ocurrió un error' }));
  }
  try {
    if(!description)
      return callback(null,failure({status:false,error:'Se necesita un nombre del tipo de plazo'}))

    if(!punctual_rate)
      return callback(null,failure({status:false,error:'Se necesita un tipo de tasa puntual'}))
    
    if(!normal_rate)
      return callback(null,failure({status:false,error:'Se necesita un tipo de tasa normal'}))
    if(!weeks)
      return callback(null,failure({status:false,error:'Se necesitan las semanas para poder crear un plazo'}))
    await Installment.create({punctual_rate,normal_rate,description,weeks})

    return callback(null, success({ status: 'Tipo de plazo creado con éxito' }));
  }catch({message}){
    console.log(message);
    return callback(null, notAllowed({ status: false, message }));
  }
}

export async function getInstallments(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  const publicKey = event.headers.Authorization;
  try {
    await dbConnect();
    const installments = await Installment.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    })
    return callback(null, success(installments));
  } catch ({ message }) {
    console.log(message);
    return callback(null, notAllowed({ status: false, message }));
  }
}

export async function search(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(event);
  const { search } = JSON.parse(event.body || {});
  try {
    await SQLConnection.authenticate();
  } catch (e) {
    console.log(e);
    return callback(null, notAllowed({ status: false, error: 'Ocurrió un error' }));
  }
  try{
    if(!search)
      return callback(null,failure({status:false,error:'Es necesario definir un criterio de búsqueda'}))
      const products = await SQLConnection.query(
        `SELECT
          id,
          name,
          sku,
          description, 
          price
        FROM products
        WHERE (sku LIKE '%${search}%' OR name LIKE '%${search}%')
        `,
        { type: Sequelize.QueryTypes.SELECT },
      );

    return callback(null, success(products));
  }catch({message}){

    console.log(message);
    return callback(null, notAllowed({ status: false, message }));
  }
}
