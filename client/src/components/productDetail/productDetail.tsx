/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import './productDetail.css';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {productDetail} from '../../app/reducers/handleProductsReducer';
import ColorCircle from '../colorCircle/ColorCircle';
import {changeProductInDBAsync, getProductByIdAsync}
  from '../../app/actions/handleProductsActions/index';
import UserReviews from '../userReviews/userReviews';
import Carousel from '../carousel/carousel';
import {userInfo, userToken} from '../../app/reducers/registerReducer';
import {addProductInCart} from '../../app/actions/cartActions/index';
import RatingStars from '../ratingStars/ratingStars';
import swal from 'sweetalert2';

function ProductDetail(props:any ) {
  const token = useAppSelector(userToken);
  const User = useAppSelector(userInfo);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();
  const product = useAppSelector(productDetail);
  const [changes, setChanges] = useState({
    id: '',
    name: '',
    picture: [],
    price: '',
    size: '',
    color: [],
    available: true,
    stock: '',
    description: '',
    categories: [],
    rating: '',
  });
  const id = props.match.params.id;
  useEffect(() => {
    dispatch(getProductByIdAsync(id))
        .then((p) => {
          setChanges(product);
        }).catch((err) => console.error(err));
  }, []);
  const handleOnClick = () => {
    const duplicate = JSON.parse(localStorage
        .getItem('cart') || '[]').find((el) => el.id === product.id);
    if (duplicate) {
      swal.fire({
        text: 'You already added this product to cart!',
        icon: 'info',
      });
    } else {
      dispatch(addProductInCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.picture[0],
        stock: product.stock,
        amount: 1,
      }, User.id));
      swal.fire({
        text: 'Product added succesfully!',
        icon: 'success',
      });
    }
  };
  // saves changes to product
  const handleProductChange = () => {
    dispatch(changeProductInDBAsync(changes, token))
        .then((r) => {
          if (r !== 'error') {
            swal.fire({
              text: 'Changes Saved!',
              icon: 'success',
            });
          } else {
            swal.fire({
              text: 'Oops, something went wrong',
              icon: 'error',
            });
          }
        }).catch((err) => console.error(err));
  };
  const handleNameChange = (e:any) => setChanges({...changes, name: e.target.innerText});
  const handleDescriptionChange = (e:any) => setChanges({...changes, description: e.target.innerText});
  const handleStockChange = (e:any) => setChanges({...changes, stock: e.target.innerText});
  const handleSizeChange = (e:any) => setChanges({...changes, size: e.target.innerText});
  const handlePriceChange = (e:any) => setChanges({...changes, price: e.target.innerText});
  return (
    <div className='productDetailBackground'>
      {
        product === null &&
            <h1 className='ProductDetailLoadingHeader'>
              Loading...
            </h1>
      }
      { product !== null &&
      <div>
        <div className='ProductDetailGridAll'>
          <div className='carouselandinfo'>
            <Carousel pictures={product.picture}/>
            <div className='ProductDetailGrid'>
              <h2 className={!editMode ? 'ProductDetailName' : 'editableProductDetailName'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleNameChange}>{
                product.name}
              <div className='ProductDetailRating'>
                <RatingStars rating={product.rating}/>
              </div>
              </h2>
              <div className='productDetailinformation'>
                <div className='productDetailButton'>
                  <p>Price:
                    { product.priceDiscount || product.discount ?
                  <span className='ProductDetailPrices'>
                    <span className='productDetailPriceDiscount' onInput={handlePriceChange}>
                      ${product.price}
                    </span>
                    {product.priceDiscount ?
                    <span className='productDetailDiscount'> ${product.priceDiscount}</span> :
                    <span className='productDetailDiscount'> ${product.price - parseFloat((props.price * props.discount/100).toFixed(2))}</span>}
                  </span> :
                    <span className={editMode ? 'editable' :'noteditable'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handlePriceChange}>
                      ${product.price}
                    </span>
                    }
                  </p>
                  {
                    User.role !== 'Admin' ?
                      <button className='productDetailAddToCart' onClick={handleOnClick}
                      >
                        Add to Cart
                      </button>:
                      <button type='button' className=' material-icons productDetailEdit' onClick={() => setEditMode(!editMode)}>
                        edit
                      </button>
                  }
                  {
                      changes?.name !== product.name || changes?.description !== product.description || changes?.price !== product.price || changes?.size !== product.size || changes?.stock !== product.stock ?
                      <button className='material-icons productDetailSave' onClick={handleProductChange}>save</button> : null
                  }
                </div>
                <div className='productDetailInfo'>
                  <div className='ProductDetailColors'>
                    <span className='productDetailColorsTitle'>Color: </span>
                    {product.color.length ?
                product.color.map((el:any) => <ColorCircle key={el} color={el}
                  onClick={() => {
                    const toChange =
                product.color.filter((color:any) => el !== color);
                    setChanges({...changes, color: toChange});
                  }}/>):null}</div>
                  <p>Stock:
                    <span className={editMode ? 'editable':'noteditable'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleStockChange}>
                      {product.stock}
                    </span>
                  </p>
                  <p>Size:
                    <span className={editMode ? 'editable':'noteditable'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleSizeChange}>
                      {product.size}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='detailDescription'>
            <h3 className='productDetailDescritionTitle'>Description</h3>
            <p className={editMode ? 'editableProductDetailDescription': 'ProductDetailDescription'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleDescriptionChange}>
              {product.description}
            </p>
          </div>
        </div>
        <UserReviews id={id}/>
      </div>
      }
    </div>
  );
}

export default ProductDetail;
