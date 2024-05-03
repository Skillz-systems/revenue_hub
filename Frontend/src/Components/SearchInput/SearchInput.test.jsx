// import { fireEvent, render, screen } from '@testing-library/react';
// import SearchInput from './SearchInput';
// import React from 'react';
// import { describe, it, expect, vi } from 'vitest';

// describe('SearchInput Component', () => {
//     it('renders without crashing', () => {
//         render(<SearchInput onSearch={() => { }} />);
//     });

//     it('starts with empty input and unfocused state', () => {
//         render(<SearchInput onSearch={() => { }} />);
//         const inputElement = screen.getByPlaceholderText('Search here') as HTMLInputElement;
//         expect(inputElement.value).toBe('');
//         expect(inputElement).not.toHaveFocus();
//     });

//     it('displays placeholder text correctly', () => {
//         render(<SearchInput onSearch={() => { }} />);
//         const inputElement = screen.getByPlaceholderText('Search here');
//         expect(inputElement).toBeInTheDocument();
//     });

//     it('updates query state when typing', () => {
//         render(<SearchInput onSearch={() => { }} />);
//         const inputElement = screen.getByPlaceholderText('Search here');
//         fireEvent.change(inputElement, { target: { value: 'test' } });
//         expect((inputElement as HTMLInputElement).value).toBe('test');
//     });

//     it('displays search icon when input is not focused', () => {
//         render(<SearchInput onSearch={() => { }} />);
//         const searchIcon = screen.getByAltText('Search Logo');
//         expect(searchIcon).toBeInTheDocument();
//     });

//     it('calls onSearch function when search icon is clicked', () => {
//         const onSearchMock = vi.fn();
//         render(<SearchInput onSearch={onSearchMock} />);
//         const inputElement = screen.getByPlaceholderText('Search here');
//         const searchIcon = screen.getByAltText('Search Logo');
//         fireEvent.change(inputElement, { target: { value: 'test' } });
//         fireEvent.click(searchIcon);
//         expect(onSearchMock).toHaveBeenCalledWith('test');
//     });

//     it('calls onSearch function when Enter key is pressed', () => {
//         const onSearchMock = vi.fn();
//         render(<SearchInput onSearch={onSearchMock} />);
//         const inputElement = screen.getByPlaceholderText('Search here');
//         fireEvent.change(inputElement, { target: { value: 'test' } });
//         fireEvent.keyPress(inputElement, { key: 'Enter', code: 13, charCode: 13 });
//         expect(onSearchMock).toHaveBeenCalledWith('test');
//     });
// });