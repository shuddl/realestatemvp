'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data for housing authorities
const housingAuthorities = [
  {
    id: 1,
    name: 'Chicago Housing Authority',
    state: 'IL',
    phone: '(312) 742-8500',
    website: 'https://www.thecha.org',
    email: 'info@thecha.org',
    inspectionScheduling: 'Online portal',
    paymentTimeline: '1st of month',
    approvalTime: '2-3 weeks',
  },
  {
    id: 2,
    name: 'Houston Housing Authority',
    state: 'TX',
    phone: '(713) 260-0500',
    website: 'https://housingforhouston.com',
    email: 'info@housingforhouston.com',
    inspectionScheduling: 'Phone',
    paymentTimeline: '5th of month',
    approvalTime: '10-14 days',
  },
  {
    id: 3,
    name: 'New York City Housing Authority',
    state: 'NY',
    phone: '(718) 707-7771',
    website: 'https://www1.nyc.gov/site/nycha/index.page',
    email: 'customercontact@nycha.nyc.gov',
    inspectionScheduling: 'Phone',
    paymentTimeline: '1st of month',
    approvalTime: '3-4 weeks',
  },
  {
    id: 4,
    name: 'Los Angeles Housing Authority',
    state: 'CA',
    phone: '(213) 252-2500',
    website: 'https://www.hacla.org',
    email: 'info@hacla.org',
    inspectionScheduling: 'Online portal',
    paymentTimeline: '2nd of month',
    approvalTime: '2-3 weeks',
  },
  {
    id: 5,
    name: 'Atlanta Housing Authority',
    state: 'GA',
    phone: '(404) 892-4700',
    website: 'https://www.atlantahousing.org',
    email: 'info@atlantahousing.org',
    inspectionScheduling: 'Phone or email',
    paymentTimeline: '5th of month',
    approvalTime: '7-10 days',
  },
];

// Downloadable resources
const resources = [
  {
    id: 1,
    title: 'HUD Housing Quality Standards (HQS) Checklist',
    category: 'Inspection',
    description: 'Complete checklist of all HUD requirements for passing Section 8 inspections.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 2,
    title: 'Section 8 Landlord Application',
    category: 'Forms',
    description: 'Standard application form for landlords to join the Section 8 program.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 3,
    title: 'Request for Tenancy Approval (RFTA)',
    category: 'Forms',
    description: 'Required form when a Section 8 tenant wants to rent your property.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 4,
    title: 'Lead-Based Paint Disclosure',
    category: 'Forms',
    description: 'Mandatory disclosure for pre-1978 properties regarding lead paint.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 5,
    title: 'Section 8 Lease Addendum',
    category: 'Forms',
    description: 'Required addendum for all Section 8 leases with program-specific provisions.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 6,
    title: 'Rent Increase Request Form',
    category: 'Forms',
    description: 'Standard form for requesting a rent increase on Section 8 properties.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 7,
    title: 'Pre-Inspection Preparation Guide',
    category: 'Guides',
    description: 'Comprehensive checklist to prepare your property for Section 8 inspection.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
  {
    id: 8,
    title: 'Fair Housing Guidelines for Section 8',
    category: 'Guides',
    description: 'Explanation of fair housing laws specific to Section 8 landlords.',
    fileType: 'PDF',
    downloadUrl: '#',
  },
];

// Common compliance issues
const commonIssues = [
  {
    id: 1,
    title: 'Electrical Safety Violations',
    description: 'Missing or malfunctioning smoke/CO detectors, exposed wiring, overloaded circuits.',
    solution: 'Install smoke detectors in every bedroom and one per floor. Replace damaged electrical outlets and cover plates. Ensure proper GFCI outlets in wet areas.',
    frequency: 'Very Common',
    severity: 'High',
  },
  {
    id: 2,
    title: 'Security Issues',
    description: 'Inoperable locks, broken windows, unsecure entries.',
    solution: 'Install deadbolts on all exterior doors. Ensure all windows have working locks and are not cracked or broken. Secure all entry points.',
    frequency: 'Common',
    severity: 'High',
  },
  {
    id: 3,
    title: 'Ventilation Problems',
    description: 'Inadequate bathroom ventilation, kitchen ventilation issues.',
    solution: 'Install or repair bathroom exhaust fans. Ensure proper kitchen ventilation either through windows or exhaust systems. Fix any blocked vents.',
    frequency: 'Common',
    severity: 'Medium',
  },
  {
    id: 4,
    title: 'Plumbing and Water Issues',
    description: 'Leaking faucets, inadequate water pressure, drainage problems.',
    solution: 'Fix all leaks, even minor ones. Ensure adequate water pressure in all fixtures. Clear any slow drains and fix toilet running/flushing issues.',
    frequency: 'Very Common',
    severity: 'Medium',
  },
  {
    id: 5,
    title: 'Lead Paint Hazards',
    description: 'Peeling paint in pre-1978 homes, undisclosed lead paint risks.',
    solution: 'Test for lead paint. Properly remediate any lead paint issues with certified contractors. Provide required disclosures to tenants.',
    frequency: 'Common in Older Properties',
    severity: 'High',
  },
  {
    id: 6,
    title: 'Heating System Issues',
    description: 'Inadequate heating, unmaintained systems, safety hazards.',
    solution: 'Ensure heating system works properly in all rooms. Annual maintenance by HVAC technician. Install carbon monoxide detectors if using gas heating.',
    frequency: 'Seasonal',
    severity: 'High',
  },
];

export default function ComplianceHub() {
  const [activeTab, setActiveTab] = useState('resources');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [filteredAuthorities, setFilteredAuthorities] = useState(housingAuthorities);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter housing authorities by state and search term
  const handleAuthorityFilter = () => {
    let filtered = housingAuthorities;
    
    if (selectedState) {
      filtered = filtered.filter(authority => authority.state === selectedState);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(authority => 
        authority.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAuthorities(filtered);
  };

  // Filter resources by category
  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  // Get unique states from housing authorities
  const states = [...new Set(housingAuthorities.map(auth => auth.state))].sort();
  
  // Get unique categories from resources
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Section 8 Compliance Hub</h1>
          <p className="text-gray-600 mt-2">Everything landlords need to succeed with Section 8 housing</p>
        </div>
        <Link 
          href="/properties"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
        >
          Back to Properties
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 font-medium ${activeTab === 'resources' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Resources & Forms
        </button>
        <button
          onClick={() => setActiveTab('authorities')}
          className={`px-4 py-2 font-medium ${activeTab === 'authorities' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Housing Authorities
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 font-medium ${activeTab === 'issues' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Common Inspection Issues
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 font-medium ${activeTab === 'calculator' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          FMR Calculator
        </button>
      </div>

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800">Section 8 Documents & Resources</h2>
              <p className="text-gray-600">Download official forms and helpful guides</p>
            </div>
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">{resource.category}</span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{resource.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{resource.fileType}</span>
                    <a 
                      href={resource.downloadUrl}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Need a Custom Form?</h3>
            <p className="text-blue-700 mb-4">We can help you create custom forms specific to your local housing authority requirements.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Request Custom Form
            </button>
          </div>
        </div>
      )}

      {/* Housing Authorities Tab */}
      {activeTab === 'authorities' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Housing Authority Directory</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAuthorityFilter}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Housing Authority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspection Scheduling</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Timeline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAuthorities.map(authority => (
                  <tr key={authority.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{authority.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{authority.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{authority.phone}</div>
                      <div className="text-sm text-blue-600 hover:underline">
                        <a href={authority.website} target="_blank" rel="noopener noreferrer">Website</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {authority.inspectionScheduling}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {authority.paymentTimeline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {authority.approvalTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAuthorities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No housing authorities found matching your search criteria.
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Don't see your local housing authority?</h3>
            <p className="text-yellow-700 mb-4">We're constantly updating our database. Let us know which housing authority you'd like to see added.</p>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Suggest a Housing Authority
            </button>
          </div>
        </div>
      )}

      {/* Common Issues Tab */}
      {activeTab === 'issues' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Common Section 8 Inspection Issues</h2>
            <p className="text-gray-600">Prepare for your inspection by addressing these frequently cited problems</p>
          </div>

          <div className="space-y-6">
            {commonIssues.map(issue => (
              <div key={issue.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      issue.frequency.includes('Very Common') 
                        ? 'bg-red-100 text-red-800' 
                        : issue.frequency.includes('Common')
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {issue.frequency}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      issue.severity === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : issue.severity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.severity} Severity
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Problem</h4>
                    <p className="text-gray-700">{issue.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Solution</h4>
                    <p className="text-gray-700">{issue.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Pre-Inspection Consultation</h3>
              <p className="text-green-700 mb-4">Schedule a walkthrough with one of our Section 8 specialists before your official inspection.</p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
                Schedule Consultation
              </button>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Compliance Certification</h3>
              <p className="text-purple-700 mb-4">Earn a certification as a Section 8 compliant landlord through our education program.</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FMR Calculator Tab */}
      {activeTab === 'calculator' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Fair Market Rent (FMR) Calculator</h2>
            <p className="text-gray-600">Find the maximum Section 8 rent for your property location</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  placeholder="Enter ZIP code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md">
                  <option value="0">Studio/Efficiency</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md">
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Calculate FMR
              </button>
            </div>

            {/* Sample Results (would be dynamically generated) */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">FMR Results for Demo</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded border">
                  <div className="text-sm text-gray-500">Studio</div>
                  <div className="text-xl font-bold text-green-600">$1,100</div>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="text-sm text-gray-500">1 Bedroom</div>
                  <div className="text-xl font-bold text-green-600">$1,300</div>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="text-sm text-gray-500">2 Bedrooms</div>
                  <div className="text-xl font-bold text-green-600">$1,550</div>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="text-sm text-gray-500">3 Bedrooms</div>
                  <div className="text-xl font-bold text-green-600">$1,950</div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p><strong>Note:</strong> Fair Market Rent values are established by HUD and represent the estimated amount (including utilities) needed to rent privately owned, decent, safe, and sanitary rental housing.</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <h4 className="font-medium mb-2">About the FMR Calculator:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Data sourced directly from HUD's FMR dataset</li>
                <li>Updated annually when new FMR values are published</li>
                <li>Housing authorities may adjust actual payment standards between 90-110% of FMR</li>
                <li>Some areas may have Small Area Fair Market Rents (SAFMRs) that vary by ZIP code</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Request a Rent Reasonableness Assessment</h3>
            <p className="text-indigo-700 mb-4">Need help determining if your desired rent meets Section 8 requirements? Our experts can help with a comparative market analysis.</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Request Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}