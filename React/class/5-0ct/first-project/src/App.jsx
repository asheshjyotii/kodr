import React, { useState } from 'react'

const App = () => {

  const [FormData, setFormData] = useState({
    email:"hello",
    pass:"",
    bye:""
  })

  console.log(FormData);
  
  //dynamic handling func, takes each event and 
  let handleChange = (e)=>{
    // target has all properties
    console.dir(e.target);

    let {name,value,namespaceURI} = e.target;
    setFormData({...FormData, [name]:[name]+value,  "bye":namespaceURI})
  }
  return (
    <form action="" onSubmit={(e)=>{
      e.preventDefault();
      
    }}>
      <input type="text" name='email' placeholder='email' id='email' onChange={handleChange} />
      <input type="text" name= "pass" placeholder='pass' onChange={handleChange} />
      <button>submit</button>
    </form>
  )
}

export default App