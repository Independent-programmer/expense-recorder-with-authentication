import Button from "../Button/Button";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import usePagination from "./Pagination";
import Stack from "@mui/material/Stack";
import { Pagination } from "@material-ui/lab";
import Modal from "../Modal/Modal";
import { useState } from "react";
const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});
let formIsValid = true;

const expensesList = (props) => {
  console.log(props.onselectedPage);
  const rows = props.items;
  console.log(props);
  const classes = useStyles();
  const [deleteModal, setDeleteModal] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const count = Math.ceil(props.totalItems / PER_PAGE);
  const _DATA = usePagination(
    props.items,
    props.totalItems,
    PER_PAGE,
    props.token
  );
  console.log("_DATA", _DATA);

  const handleChange = (e, p) => {
    setPage(p);
    props.onSelectPage(p);
    _DATA.jump(p);
  };

  function toggleDeleteRow() {
    setDeleteModal(true);
  }
  function deleteRow(event) {
    props.onDelete(event._id);
    setDeleteModal(false);
  }

  function editRow(event) {
    console.log(event._id);
    props.onStartEdit({
      title: event.title,
      amount: event.amount,
      date: new Date(event.date),
      id: event._id,
      event,
    });
  }

  const cancelPostChangeHandler = () => {
    setDeleteModal(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_DATA.currentData().map((row) => (
            <TableRow key={row._id}>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">
                {new Date(row.date).toISOString().slice(0, 10)}
              </TableCell>

              <TableCell align="right">
                <Button mode="flat" onClick={() => editRow(row)}>
                  EDIT
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button mode="flat" design="danger" onClick={toggleDeleteRow}>
                  DELETE
                </Button>
                {deleteModal && (
                  <Modal
                    title="Warning"
                    acceptEnabled={formIsValid}
                    onCancelModal={cancelPostChangeHandler}
                    onAcceptModal={() => deleteRow(row)}
                    isLoading={props.loading}
                  >
                    <p>Are you sure want to delete?</p>
                  </Modal>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack alignItems="center">
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Stack>
    </TableContainer>
  );
};

export default expensesList;
