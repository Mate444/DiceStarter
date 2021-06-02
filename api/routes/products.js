/* eslint-disable no-nested-ternary */
const express = require('express');

const router = express.Router();

const { Op } = require('sequelize');

const { Product, Category } = require('../db');

function onOrder(param, array) {
  switch (param) {
    case 'A-Z': return array.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (b.name > a.name) return -1;
      return 0;
    });
    case 'Z-A': return array.sort((a, b) => {
      if (a.name < b.name) return 1;
      if (b.name < a.name) return -1;
      return 0;
    });
    case 'minPrice': return array.sort((a, b) => (
      (a.priceDiscount ? a.priceDiscount : a.price) - (b.priceDiscount ? b.priceDiscount : b.price)
    ));
    case 'maxPrice': return array.sort((a, b) => (
      (b.priceDiscount ? b.priceDiscount : b.price) - (a.priceDiscount ? a.priceDiscount : a.price)
    ));
    case 'minRating': return array.sort((a, b) => (
      a.rating - b.rating
    ));
    case 'maxRating': return array.sort((a, b) => (
      b.rating - a.rating
    ));
    default: return array;
  }
}

router.get('/', (req, res, next) => {
  const {
    page, filter, order, name,
  } = req.query;
  if (filter !== '') {
    Product.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      include: [{ model: Category, where: { name: { [Op.like]: `%${filter}%` } }, attributes: ['id', 'name'] }],
    })
      .then((response) => {
        if (order !== '') {
          onOrder(order, response);
        }
        return res.json({
          products: response.slice((page - 1) * 9, page * 9),
          totalPages: Math.ceil(response.length / 9),
        });
      }).catch((e) => {
        next(e);
      });
  }
  if (filter === '') {
    Product.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      include: [{ model: Category, attributes: ['id', 'name'] }],
    })
      .then((response) => {
        if (order !== '') {
          onOrder(order, response);
        }
        return res.json({
          products: response.slice((page - 1) * 9, page * 9),
          totalPages: Math.ceil(response.length / 9),
        });
      }).catch((e) => {
        next(e);
      });
  }
});

router.get('/bestRated', (req, res, next) => {
  Product.findAll({
    where: { rating: { [Op.gte]: 4 } },
    include: [{ model: Category, attributes: ['id', 'name'] }],
  })
    .then((response) => {
      onOrder('maxRating', response);
      const bestProducts = response.slice(0, 5);
      res.send(bestProducts);
    }).catch((e) => {
      next(e);
    });
});

module.exports = router;
