'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Globe, Phone, MapPin, CreditCard, Building2, Calendar } from 'lucide-react' // Optional: Icons add a lot of polish

enum Tabs {
  MAIN = "main",
  QUOTATIONS = "quotations",
  INVOICES = "invoices"
}

const CustomerDetails = () => {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.MAIN)
  const searchParams = useSearchParams()
  const customerId = searchParams.get("customerId")

  // Mock data (In a real app, this would be fetched via customerId)
  const client = {
    "idClient": "c7891f2a-45de-4c2b-b601-a9133ee1d1e9",
    "username": "johndoe",
    "categorie": "Premium",
    "siteWeb": "https://example.com",
    "adresse": "123 Rue de Paris, France",
    "telephone": "+33 6 12 34 56 78",
    "email": "client@example.com",
    "typeClient": "ENTREPRISE",
    "raisonSociale": "Example SARL",
    "numeroTva": "FR123456789",
    "codeClient": "CLT-2025-001",
    "limiteCredit": 50000,
    "soldeCourant": 12500.75,
    "actif": true,
    "createdAt": "2025-01-01T10:30:00.000Z",
    "updatedAt": "2025-02-15T15:42:10.000Z",
  }

  const InfoCard = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-100">
      <dt className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {Icon && <Icon size={14} className="text-gray-400" />}
        {label}
      </dt>
      <dd className="text-sm font-semibold text-gray-900 truncate">
        {value || <span className="text-gray-400 italic font-normal">N/A</span>}
      </dd>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case Tabs.MAIN:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Business & Contact Section */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                <Building2 size={16} /> GENERAL INFORMATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard label="Legal Name" value={client.raisonSociale} />
                <InfoCard label="VAT Number" value={client.numeroTva} />
                <InfoCard label="Phone" value={client.telephone} icon={Phone} />
                <InfoCard label="Email" value={client.email} icon={Mail} />
                <InfoCard label="Website" value={client.siteWeb} icon={Globe} />
                <InfoCard label="Address" value={client.adresse} icon={MapPin} />
              </div>
            </section>

            {/* Financial Section */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                <CreditCard size={16} /> FINANCIAL OVERVIEW
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-600 font-bold uppercase">Credit Limit</p>
                  <p className="text-2xl font-black text-blue-900">${client.limiteCredit.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-xs text-indigo-600 font-bold uppercase">Current Balance</p>
                  <p className="text-2xl font-black text-indigo-900">${client.soldeCourant.toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* System Details */}
            <section className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70">
                <InfoCard label="Client Code" value={client.codeClient} />
                <InfoCard label="Category" value={client.categorie} />
                <InfoCard label="Created" value={new Date(client.createdAt).toLocaleDateString()} icon={Calendar} />
                <InfoCard label="Internal ID" value={client.idClient} />
              </div>
            </section>
          </div>
        )
      case Tabs.QUOTATIONS:
        return <div className="p-10 text-center text-gray-400">No quotations found.</div>
      case Tabs.INVOICES:
        return <div className="p-10 text-center text-gray-400">No invoices found.</div>
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-6">
      {/* Header / Brand Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-gray-900">{client.raisonSociale}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {client.actif ? '● ACTIVE' : '● INACTIVE'}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Customer ID: {client.codeClient} • {client.categorie} Member</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          {Object.values(Tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {renderContent()}
      </div>
    </div>
  )
}

export default CustomerDetails