import React, { useState } from 'react'



const Form = ({setProducts}) => {
    const [FormData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        imageUrl: ""
      })


    function handleChange(e){
        let {name,value} = e.target

        setFormData({...FormData,[name]:value})
        
    }
    // console.log(FormData);

    function handleSubmit(){
        setProducts((prev)=>[...prev, FormData ])
        setFormData({
            title: "",
            price: "",
            category: "",
            imageUrl: ""
          })
    }
    

    
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Add Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the details of your new product.
          </p>
        </div>

        <div className="space-y-4">
          <input
            value={FormData.title}
            type="text"
            name="title"
            placeholder="Product name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                       outline-none transition
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(e)=>{
                handleChange(e);
            }}
          />

          <input
            value={FormData.price}
            type="text"
            name="price"
            placeholder="Price"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                       outline-none transition
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(e)=>{
            handleChange(e);
        }}
          />

          <input
            value={FormData.category}
            type="text"
            name="category"
            placeholder="Category"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                       outline-none transition
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(e)=>{
            handleChange(e);
        }}
          />

          <input
            value={FormData.imageUrl}
            type="text"
            name="imageUrl"
            placeholder="Thumbnail URL"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                       outline-none transition
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(e)=>{
            handleChange(e);
        }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 text-white
                     font-semibold hover:bg-blue-700
                     active:scale-[0.98] transition"
            onClick={(e)=>{
                e.preventDefault()
                handleSubmit()

            }}
        >
          Add Product
        </button>

      </form>
    </div>
  )
}

export default Form
