'use Invoice'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import TableRow from '../../components/TableRow'
import TableHeader from '@/components/TableHeader'
import { FactureResponse } from '@/src/api'

const columns = {
  "Invoice No.": "numeroFacture",
  "Client Name": "nomClient",
  "Client Email": "emailClient",
  "Bill Date": "dateFacturation",
  "Due Date": "dateEcheance",
  "Status": "etat",
  "Balance Due": "montantRestant",
  "Total (TTC)": "montantTTC",
  "Currency": "devise"
}

interface props{
  data:FactureResponse[]
}
const InvoiceTable= ({
  data
}:props) => {

  const router=useRouter();

  return (
    <div>
   <table>
    <TableHeader columns={Object.keys(columns)}/>
    <tbody>
      {
      data?.map((Invoice,index)=>{
        return (
          <TableRow key={index} properties={Object.values(columns)} dataObject={Invoice}
          method={(data:FactureResponse)=>{
            
              router.push(`/invoices/${data.idFacture}`)
           //store the Invoice in localstorage
           localStorage.setItem("invoice",JSON.stringify(Invoice))
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

export default InvoiceTable