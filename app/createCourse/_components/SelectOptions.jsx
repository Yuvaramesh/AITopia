import Image from 'next/image'
import React from 'react'

function SelectOptions({ selectedStudyType, currentValue }) {
  const Options = [
    { name: "Exam", icon: "/exam.png" },
    { name: "Practice", icon: "/practice.png" },
    { name: "Coding Prep", icon: "/code.png" },
    { name: "Others", icon: "/knowledge.png" },
  ];

  return (
    <div className='mt-5'>
      <h2 className='text-center mb-2 text-lg'>Select Study Material Type</h2>
      <div className='grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {Options.map((option, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center border rounded-xl p-4 cursor-pointer
              ${option.name === currentValue ? 'border-primary bg-blue-50' : 'hover:border-primary'}`}
            onClick={() => selectedStudyType(option.name)}
          >
            <Image 
              src={option.icon} 
              alt={option.name} 
              width={50} 
              height={50} 
              className="mb-2"
            />
            <h2 className='text-sm'>{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectOptions