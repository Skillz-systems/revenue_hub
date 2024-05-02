import { useState } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { dummyData } from './dummyData';
// import SearchIcon from '/assets/png-icons/Search.png';

const SearchInput = ({ className, onSearch }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const filteredResults = dummyData.filter(result =>
        result.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className={`relative flex items-center ${className}`}>
            <input
                type="search"
                value={query}
                placeholder='Search here'
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                className='h-8 w-full pl-2 pr-10 italic rounded-full placeholder:absolute placeholder:right-8 placeholder:text-xs border-[1px] border-[#CCD0DC] focus:outline-none focus:border-lime-300 relative active:border-green-500 focus-within:border-green-500 transition-all duration-300 ease-in outline-none'
            />
            {!isFocused ? 
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleSearch}>
                <img src={''} alt="Search Logo" className='w-4' />
            </div> : null}
            {isFocused && query && (
                <div className="absolute top-full left-0 w-full bg-white shadow p-2 rounded-b-[20px]">
                    {filteredResults.length > 0 ? (
                        filteredResults.map(result => (
                            <p key={result.id}>{result.name}</p>
                        ))
                    ) : (
                        <p>No results found</p>
                    )}
                </div>
            )}
        </div>
    );
};

SearchInput.propTypes = {
    className: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
};

export default SearchInput;




