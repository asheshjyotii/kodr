import React, { useState } from 'react'
import Form from './components/Form'

const App = () => {
  const [Products, setProducts] = useState([])
  console.log(Products);
  
  return (
    <Form setProducts={setProducts} />
  )
}

export default App