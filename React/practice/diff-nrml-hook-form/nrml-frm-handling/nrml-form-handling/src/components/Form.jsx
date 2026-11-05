import React from 'react'

const Form = () => {
  return (
    <div>
        <form action="" 
        onSubmit={
            (e)=>{
                e.preventDefault()
                console.log(e.target[0].value);
                console.log(e.target[1].value);
                console.log(e.target[2].value);
                console.log(e.target[3].value);
            }
        }
        >
            <input type="text" name='username' placeholder='username' />
            <input type="text" name='email' placeholder='email' />
            <input type="text" name='pass' placeholder='pass' />
            <button>submit</button>
        </form>
    </div>
  )
}

export default Form