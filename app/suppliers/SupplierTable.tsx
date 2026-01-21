'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import TableRow from '../../components/TableRow'
import TableHeader from '@/components/TableHeader'
import { FournisseurResponse } from '@/src/api'

// Mapping keys for display logic - Matches Supplier specific fields
const columns = {
  Username: "username",
  Type: "typeFournisseur",
  Email: "email",
  Telephone: "telephone",
  Active: "actif",
  "Created At": "createdAt"
}

interface props {
  data: FournisseurResponse[]
}

const SupplierTable = ({ data }: props) => {
  const router = useRouter();

  return (
    <div className="w-full bg-white rounded-xl border border-[var(--color-secondary-light)] shadow-sm overflow-hidden">
      {/* Scroll container for responsiveness */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full flex flex-col border-collapse text-left">
          
          <TableHeader columns={Object.keys(columns)} />
          
          <tbody className="divide-y divide-[var(--color-secondary-super-light)]">
            {data && data.length > 0 ? (
              data.map((supplier, index) => (
                <TableRow 
                  key={supplier.idFournisseur || index} 
                  properties={Object.values(columns)} 
                  dataObject={supplier}
                  method={(data: FournisseurResponse) => {
                    // Navigate to supplier details page
                    router.push(`/suppliers/${data.idFournisseur}`)
                  }}
                />
              ))
            ) : (
              <tr className="flex w-full">
                <td className="w-full px-6 py-12 text-center border-none">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-[var(--color-secondary-gray)] font-medium">
                      No suppliers found
                    </span>
                    <button className="text-xs font-bold text-[var(--color-secondary-mid)] hover:underline">
                      Add your first supplier
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-[var(--color-secondary-light)] flex justify-between items-center">
        <span className="text-xs text-[var(--color-secondary-gray)] font-medium">
          Showing <span className="text-[var(--color-primary)] font-bold">{data?.length || 0}</span> suppliers
        </span>
        <div className="flex gap-2">
           {/* Pagination controls can be added here */}
        </div>
      </div>
    </div>
  )
}

export default SupplierTable