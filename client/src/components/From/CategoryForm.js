import React from 'react'
import { FaTags, FaCheck } from 'react-icons/fa'
import '../../styles/CategoryForm.css'

const CategoryForm = ({isUpdate, handleSubmit, value, setValue}) => {
    return (
        <form onSubmit={handleSubmit} className="category-form">
            <div className='mb-3'>
                <label htmlFor="categoryName" className="form-label">Category Name</label>
                <div className="input-group">
                    <span className="input-group-text">
                        <FaTags />
                    </span>
                    <input 
                        type='text' 
                        id="categoryName"
                        className='form-control' 
                        placeholder='Enter category name' 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)} 
                        required 
                    />
                </div>
                <small className="form-text text-muted">
                    Category name should be unique and descriptive
                </small>
            </div>
            <button 
                type="submit" 
                className={`btn ${isUpdate ? 'btn-success' : 'btn-primary'} d-flex align-items-center`}
                disabled={!value.trim()}
            >
                <FaCheck className="me-2" />
                {isUpdate ? "Update Category" : "Create Category"}
            </button>
        </form>
    )
}

export default CategoryForm