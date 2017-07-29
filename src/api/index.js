import axios from 'axios';
// axios.conifg()



const getCartPage = params => axios.get('./static/cart.json', { params });

const getZone = (level, params) => axios.get('./mock/zone' + (parseInt(level)), { params });

const saveAddress = params => axios.post('./mock/success', params);

const getGoodsList = params => axios.get('/api/rest/catalog/product?___store=default&category=7', { params });
// const getGoodsList = params => axios.get('./static/imgs.json', { params });
const getGoodsListBySku = params => axios.get('/api/rest/catalog/product', { params });
// 登录页
const login = params => axios.post('/oauth/login', params);
// 首页
const getIndexPage = params => axios.get('./static/index.json', { params });
// 列表页
const getListPage = params => axios.get('./static/list.json', { params });
// 购物车相关
// const getGoodsListOfCart = params => axios.get('./static/cartGoodsList.json', { params });
const getGoodsListOfCart = params => axios.get('/api/rest/cart/item?___store=default', { params });
const getCartRecommend = params => axios.get('/api/rest/catalog/product?skus[]=YB1353&skus[]=YB1264&skus[]=XS1386&skus[]=XS1325&skus[]=YB1384&___store=default', { params });
const getCartGiftList = params => axios.get('./static/cartGoodsList.json', { params });
const addGoodsToCart = data => axios.post('/api/rest/cart/item?___store=default', data);
const removeGoodsFromCart = data => axios.delete('/api/rest/cart/item?___store=default', {data});
export default {
  getGoodsList,
  getCartPage,
  getZone,
  saveAddress,
  getGoodsListBySku,
  login,
  getIndexPage,
  getListPage,
  getGoodsListOfCart,
  getCartRecommend,
  addGoodsToCart,
  removeGoodsFromCart
};
