import React from "react";

import "./ExpensesFilter.css";

const ExpensesFilter = (props) => {
  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value);
    props.onSelectYear(event.target.value);
  };

  const yearList = props.dropDownYears.map((x) => {
    return <option key={x}>{x}</option>;
  });

  return (
    <div className="expenses-filter">
      <div className="expenses-filter__control">
        <label>Filter by year</label>
        <select value={props.selected} onChange={dropdownChangeHandler}>
          <option value="All">All</option>
          {yearList}
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;
