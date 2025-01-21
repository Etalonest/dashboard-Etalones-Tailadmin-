// MultiSelect.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    placeholder: string;
    className?: string; 
    onChange: any 

}

const CMultiSelect: React.FC<MultiSelectProps> = ({ options, placeholder, className, onChange}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    
    // const handleSelect = (option: string) => {
    //     setSelected(prev =>
    //         prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    //     );
    // };
    const handleSelect = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(o => o !== option)
            : [...selected, option];
        
        setSelected(newSelected);
        onChange(newSelected); 
    };
    const closeDropdown = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div 
                className="border  rounded-md p-1.5 cursor-pointer " 
                onClick={toggleDropdown}
            >
                {selected.length > 0 ? selected.join(', ') : placeholder}
            </div>
            {isOpen && (
                <div className=" bottom-full left-0 bg-white border border-gray-300 z-10 w-full max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <div
                            key={option.value}
                            className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelect(option.label)}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option.label)}
                                readOnly
                                className="mr-2"
                            />
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CMultiSelect;
