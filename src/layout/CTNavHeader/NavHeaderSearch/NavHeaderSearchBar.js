import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { api, elem, CTSearch } from 'utils';
import './index.scss';
import { links } from 'utils'
import _ from 'lodash';

import { NavHeaderSearchResult } from './NavHeaderSearchResult';
import SearchIcon from '@material-ui/icons/Search';

export function NavHeaderSearchBar({
  searchValue = '',
  // result = [],
  // setSearchValue,
  // setResult
}) {

  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const handleSearchChange = val => {
    setSearchText(val.target.value);
  }

  useEffect(() => {
    if (searchText.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchText])

  return (
    <div className="ct-nh-search">
      <IconButton id="ct-nh-search-button" size="small"><SearchIcon /></IconButton>
      <input
        id="ct-nh-search-input"
        label="Search"
        variant="filled"
        value={searchText}
        onChange={handleSearchChange}
        placeholder={"Search"}
        autoComplete="off"
      />

      {open && <NavHeaderSearchResult searchText={searchText} />}
    </div>
  );
}

// export const NavHeaderSearch = connectWithRedux(
//   NavHeaderSearchWithRedux,
//   ['searchValue', 'result'],
// );