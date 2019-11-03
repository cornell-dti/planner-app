import React, { ReactElement, ChangeEvent, useState } from 'react';
import Fuse from 'fuse.js';
import { FuseItem } from './types';
import DropdownItem from './DropdownItem';
<<<<<<< HEAD
// import styles from './index.module.css';
=======
import styles from './DropdownItem.module.css';
>>>>>>> parent of f38c4cb... Add arrow key handler for possible solution to arrow key support

type Props<T extends FuseItem> = {
  readonly fuse: Fuse<T>;
  readonly placeholder?: string;
  readonly inputClassname: string;
  readonly dropdownItemClassName: string;
  readonly onSelect: (selected: T) => void;
};

type State<T> = { readonly searchInput: string; readonly searchResults: readonly T[] };

export default <T extends FuseItem>(
  { placeholder, fuse, inputClassname, dropdownItemClassName, onSelect }: Props<T>,
): ReactElement => {
  const [{ searchInput, searchResults }, setState] = useState<State<T>>({
    searchInput: '', searchResults: [],
  });

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.currentTarget.value;
    if (input.length > 2) {
      const newResults = fuse.search(input);
      setState({ searchInput: input, searchResults: newResults });
    } else {
      setState({ searchInput: input, searchResults: [] });
    }
  };
<<<<<<< HEAD

  const arrowKeyHandler = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Down') {
      // TODO, possible solution can be mapping Down key to tab since tab functionality works
    }
  };
=======
>>>>>>> parent of f38c4cb... Add arrow key handler for possible solution to arrow key support
 
  const onResultSelected = (item: T): void => {
    onSelect(item);
    setState({ searchInput: '', searchResults: [] });
  };
  
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        className={inputClassname}
        value={searchInput}
        onChange={onSearchChange}
      />
      <div>
        {searchResults.map((item) => (
          <DropdownItem
            key={item.key}
            item={item}
            className={dropdownItemClassName}
            onSelect={onResultSelected}
          />
        ))}
      </div>
    </div>
  );
};
