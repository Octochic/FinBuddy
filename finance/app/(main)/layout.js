import React from 'react'

const Mainlayout = ({children}) => {
  return (
    <div className='container mx-auto px-4 py-32'>
      {children}
    </div>
  )
}

export default Mainlayout
