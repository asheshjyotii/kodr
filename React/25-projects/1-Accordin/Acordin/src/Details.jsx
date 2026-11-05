import React from 'react'

const Details = ({data}) => {
  return (
    <div className='w-3xs md:w-100 h-20 md:h-30 bg-emerald-50 rounded-b-xl px-5 py-3 text-slate-500'>
        <p className=' text-lg'>{data}</p>
    </div>
  )
}

export default Details