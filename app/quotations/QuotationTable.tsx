'use quotation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import TableRow from '../../components/TableRow'
import TableHeader from '@/components/TableHeader'
import { DevisResponse } from '@/src/api'
const columns={
 "Devis Number":"numeroDevis",
  "quotation Name":"nomquotation",
  "quotation Email":"emailquotation",
  "Creation Date":"dateCreation",
  "Valid Until":"dataValidite",
  "Created At":"createdAt",
  "Status":"statut",
  "Total Amount":"montanTTC",
  "Currency":"devise"
}

interface props{
  data:DevisResponse[]
}
const QuotationTable= ({
  data
}:props) => {

  const router=useRouter();

  return (
    <div>
   <table>
    <TableHeader columns={Object.keys(columns)}/>
    <tbody>
      {
      data?.map((quotation,index)=>{
        return (
          <TableRow key={index} properties={Object.values(columns)} dataObject={quotation}
          method={(data:DevisResponse)=>{
            
              router.push(`/quotations/${data.idDevis}`)
           //store the Quotation in localstorage
           localStorage.setItem("quotation",JSON.stringify(quotation))
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

export default QuotationTable