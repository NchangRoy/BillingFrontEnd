import React from 'react'
import TableRow from '../../components/TableRow'
import TableHeader from '@/components/TableHeader'

import { FournisseurResponse } from '@/src/api'
const columns={
  Username:"username",
  Type:"typeFournisseur",
  Email:"email",
  Telephone:"telephone",
  Active:"actif",
  CreatedAt:"createdAt"
}

interface props{
  data:FournisseurResponse[]
}
const SupplierTable= ({
  data
}:props) => {


  return (
    <div>
   <table>
    <TableHeader columns={Object.keys(columns)}/>
    <tbody>
      {
      data?.map((client,index)=>{
        return (
          <TableRow key={index} properties={Object.values(columns)} dataObject={client}/>
        )
      })
    }
    </tbody>

    
    
    </table>     
        
   </div>


  )
}

export default SupplierTable