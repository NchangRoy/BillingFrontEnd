'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ClientResponse } from '@/src/api'
import FilterButton from '../../components/FilterButton'
import DropDown from "@mui/icons-material/ArrowDropDown"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import CustomerTable from './CustomerTable'

const Consumer = () => {
  const router = useRouter();

  // 1. State Management
  const [showTypeMenu, setShowTypeMenu] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 2. Filter Logic
  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter((client) => {
      const matchesSearch = 
        client.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !activeOnly || client.actif === true;
      const matchesType = !selectedType || client.typeClient === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, activeOnly, selectedType]);

  // 3. Navigation Handler
  const handleCreateNew = () => {
    router.push('/customers/new');
  };

  return (
    <div className='max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8 bg-secondary-super-light/20 min-h-screen'>
      
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-secondary text-4xl font-black tracking-tight'>Customers</h1>
          <p className='text-gray-500 mt-1 font-medium'>Manage your client relationships and profiles</p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          {/* Search Bar */}
          <div className='flex items-center bg-white border border-secondary-light/50 px-4 py-2.5 rounded-2xl shadow-sm focus-within:border-secondary-mid transition-all w-full md:w-80'>
            <input 
              type="text" 
              className='border-none outline-none text-gray-700 w-full bg-transparent text-sm font-medium' 
              placeholder='Search by name or email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className='text-secondary-mid' />
          </div>

          {/* Create Customer Button */}
          <button 
            onClick={handleCreateNew}
            className='flex items-center justify-center gap-2 px-6 py-3 bg-secondary-mid text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary-mid/20 hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap'
          >
            <AddIcon fontSize="small" /> 
            Add Customer
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-secondary-light/20 flex flex-col md:flex-row md:items-center gap-6">
        <div className='flex items-center gap-2 border-r border-secondary-super-light pr-6'>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Filters</span>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          {/* Status Toggle */}
          <button
            onClick={() => setActiveOnly(!activeOnly)}
            className={`px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${
              activeOnly 
              ? "border-secondary-mid bg-secondary-super-light text-secondary-mid" 
              : "border-secondary-super-light text-gray-500 hover:border-secondary-light bg-white"
            }`}
          >
            {activeOnly ? "● Active Only" : "All Statuses"}
          </button>

          {/* Customer Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${
                showTypeMenu || selectedType 
                ? "border-secondary-mid bg-secondary-super-light text-secondary-mid" 
                : "border-secondary-super-light text-gray-500 hover:border-secondary-light bg-white"
              }`}
            >
              <span>{selectedType ? `Type: ${selectedType}` : "Select Type"}</span>
              <DropDown className={`transition-transform duration-300 ${showTypeMenu ? 'rotate-180' : ''}`} />
            </button>

            {showTypeMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-secondary-light/20 rounded-xl shadow-xl z-20 flex flex-col min-w-[220px] overflow-hidden animate-in fade-in slide-in-from-top-1">
                <button 
                  onClick={() => { setSelectedType(null); setShowTypeMenu(false); }}
                  className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 text-gray-400 border-b border-gray-50"
                >
                  Clear Selection
                </button>
                {Object.values(ClientResponse.typeClient).map((type) => (
                  <button
                    key={type}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-600 hover:bg-secondary-super-light hover:text-secondary-mid transition-colors"
                    onClick={() => {
                      setSelectedType(type);
                      setShowTypeMenu(false);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='bg-white rounded-2xl shadow-sm border border-secondary-light/20 overflow-hidden'>
        <CustomerTable data={filteredClients}/>
        
        {filteredClients.length === 0 && (
          <div className='p-24 text-center bg-secondary-super-light/10'>
            <div className='mb-4 opacity-20'>
               <SearchIcon sx={{ fontSize: 64 }} className="text-secondary" />
            </div>
            <p className='text-gray-400 font-bold uppercase tracking-widest text-xs'>No matching customers found</p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- MOCK DATA ---
const MOCK_CLIENTS: ClientResponse[] = [
  {
    idClient: "1",
    username: "JohnDoe",
    typeClient: ClientResponse.typeClient.PARTICULIER,
    email: "john@example.com",
    telephone: "123456789",
    actif: true,
    createdAt: "2025-12-07T12:00:00Z",
  },
  {
    idClient: "2",
    username: "Acme Corp",
    typeClient: ClientResponse.typeClient.ENTREPRISE,
    email: "contact@acme.com",
    telephone: "987654321",
    actif: false,
    createdAt: "2025-11-01T10:00:00Z",
  }
];

export default Consumer;