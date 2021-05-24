import React, {useEffect} from 'react';
import ProductCards from '../productCards/productCards';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {totalPages,
  queryFilter,
  queryName,
  querySort,
  productsList,
} from '../../app/reducers/handleProductsReducer';
import ProductsSelect from '../productSelects/productSelects';
import Paginate from '../paginate/paginate';
import {getProductsAsync} from '../../app/actions/handleProductsActions';
import './home.css';
import {getCheckoutTicket} from '../../app/actions/cartActions/index';
import {userInfo} from '../../app/reducers/registerReducer';
import {useLocation} from 'react-router-dom';

function Home(props: any) {
  const searchName = useAppSelector(queryName);
  const searchFilter = useAppSelector(queryFilter);
  const searchSort = useAppSelector(querySort);
  const pagesTotal = useAppSelector(totalPages);
  const products = useAppSelector(productsList);
  const User = useAppSelector(userInfo);
  const dispatch = useAppDispatch();
  const status = new URLSearchParams(useLocation().search).get('status');
  const foundQueryNumber = props.location.search.indexOf('=');
  let page = parseInt(props.location.search.slice(foundQueryNumber +1));
  useEffect(() => {
    if (!page) page = 1;
    if (page === NaN) page = 1;
    dispatch(getProductsAsync({
      name: searchName,
      page: page,
      filter: searchFilter,
      sort: searchSort,
    }));
  }, [page]);
  useEffect(() => {
    const checkout = props.location.search;
    console.log(checkout);
    if (checkout.includes('status')) {
      dispatch(getCheckoutTicket(User.firstName,
          User.lastName, User.email, status));
    }
  }, []);
  return (
    <div className='homeBackground'>
      {
        <ProductsSelect />
      }
      {
        products === null &&
       <div className='homeLoading'>
         Loading...
       </div>
      }
      <div>
        { products !== null &&
          <div className='homeGood'>
            <ProductCards></ProductCards>
            <Paginate page={page} pagesTotal={pagesTotal}/>
          </div>
        }
      </div>
    </div>
  );
}

export default Home;
