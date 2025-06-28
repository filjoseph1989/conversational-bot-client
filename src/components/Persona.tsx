import React from 'react';

interface PersonaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Persona: React.FC<PersonaProps> = ({ value, onChange }) => {
    return (
        <>
            <label className="font-medium" htmlFor="persona"> Persona: </label>
            <input
                id='persona'
                type="text"
                value={value}
                onChange={onChange}
                placeholder="e.g. Friendly AI assistant"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required />
        </>
    );
};

export default Persona;