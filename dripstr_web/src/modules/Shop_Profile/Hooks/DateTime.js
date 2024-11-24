import  React, { useState , useEffect } from 'react'

export const DateTime = () => {

    var [date,setDate] = useState(new Date());
    
    useEffect(() => {
        var timer = setInterval(()=>setDate(new Date()), 1000 )
        return function cleanup() {
            clearInterval(timer)
        }
    
    });

    return(
        <div>
            <p className='font-semibold'> Time : <span className='font-normal text-sm'> {date.toLocaleTimeString()} </span></p>
            <p className='font-semibold'> Date : <span className='font-normal text-sm'> {date.toLocaleDateString()} </span></p>

        </div>
    )
}

export default DateTime