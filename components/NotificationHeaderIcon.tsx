import React, { ReactNode } from 'react'
import Link from 'next/link';
interface props{
    Icon:React.ElementType;
    number?:number;
    path:string
}

const NotificationHeaderIcon = ({
    Icon,number,path
}:props) => {
  return (
   <div className='relative'>
           <Link href={path}>
            <Icon/>
                <div className='text-[10px] bg-red-500
                 text-white w-[15px] h-[15px] text-center
                   rounded-[50%] absolute top-0 right-[-3px]'>{number}</div></Link>   

    </div>
  )
}

export default NotificationHeaderIcon