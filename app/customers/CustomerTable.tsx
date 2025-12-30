'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import TableRow from '../../components/TableRow'
import TableHeader from '@/components/TableHeader'
import { ClientResponse } from '@/src/api'
const columns={
  Username:"username",
  Type:"typeClient",
  Email:"email",
  Telephone:"telephone",
  Active:"actif",
  CreatedAt:"createdAt"
}

interface props{
  data:ClientResponse[]
}
const CustomerTable= ({
  data
}:props) => {

  const router=useRouter();

  return (
    <div>
   <table>
    <TableHeader columns={Object.keys(columns)}/>
    <tbody >
      {
      data?.map((client,index)=>{
        return (
          <TableRow key={index} properties={Object.values(columns)} dataObject={client}
          method={(data:ClientResponse)=>{
            
              router.push(`/customers/${data.idClient}`)
           
          }}
          />
        )
      })
    }
    </tbody>

    
    
    </table>     
        
   </div>


  )
}

export default CustomerTable