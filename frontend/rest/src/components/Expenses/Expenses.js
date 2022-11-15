import React, { useState } from "react";

import Card from "../UI/Card";
import ExpensesFilter from "./ExpensesFilter";
import "./Expenses.css";
import ExpensesList from "./ExpensesList";
import ExpensesChart from "./ExpensesChart";

const Expenses = (props) => {
  console.log(props);
  let arr = [];
  for (let i = 0; i < props.items.length; i++) {
    arr.push(new Date(props.items[i].date).getFullYear().toString());
  }

  let uniqueArr = arr.filter((c, index) => {
    return arr.indexOf(c) === index;
  });

  const [filteredYear, setFilteredYear] = useState("All");

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  function changeHandler(year) {
    props.onSelectedYear(year);
  }

  function pageHandler(page) {
    props.onSelectedPage(page);
  }

  const filteredChart = props.items.filter((expense) => {
    return new Date(expense.date).getFullYear().toString() === filteredYear;
  });

  return (
    <div>
      <Card className="expenses">
        <ExpensesFilter
          selected={filteredYear}
          onChangeFilter={filterChangeHandler}
          dropDownYears={uniqueArr}
          onSelectYear={changeHandler}
        />
        
        <ExpensesChart expenses={filteredChart} />
        <ExpensesList
          items={props.items}
          onStartEdit={props.onStartEdit}
          onDelete={props.onDelete}
          totalItems={props.totalItems}
          token={props.token}
          onSelectPage={pageHandler}
        />
      </Card>
    </div>
  );
};

export default Expenses;
