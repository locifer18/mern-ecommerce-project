import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchInput = () => {
    const [value, setValue] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search/${value.keyword}`);
            setValue({ ...value, results: data });
            navigate('/search');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='d-flex w-100 position-relative' role='search'>
            <FaSearch className="search-icon position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
                value={value.keyword} 
                onChange={(e) => setValue({ ...value, keyword: e.target.value })} 
                className='form-control search-input' 
                style={{ paddingLeft: '40px' }}
                type='search' 
                placeholder='Search products...' 
                aria-label='Search' 
            />
            <button className='btn btn-primary d-none' type='submit'>
                <FaSearch />
            </button>
        </form>
    )
}

export default SearchInput