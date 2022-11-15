import React, { Component, Fragment } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import { required, length } from "../../../util/validators";

const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  amount: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
  date: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
};

class FeedEdit extends Component {
  state = {
    postForm: POST_FORM,
    formIsValid: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedPost !== this.props.selectedPost
    ) {
      const postForm = {
        title: {
          ...prevState.postForm.title,
          value: this.props.selectedPost.title,
          valid: true,
        },
        amount: {
          ...prevState.postForm.amount,
          value: this.props.selectedPost.amount,
          valid: true,
        },
        date: {
          ...prevState.postForm.date,
          value:  new Date(this.props.selectedPost.date).toISOString().slice(0, 10),
          valid: true,
        },
      };
      this.setState({ postForm: postForm, formIsValid: true });
    }
  }

  postInputChangeHandler = (input, value, files) => {
    this.setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.postForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.postForm,
        [input]: {
          ...prevState.postForm[input],
          valid: isValid,
          value: files ? files[0] : value,
        },
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        postForm: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  inputBlurHandler = (input) => {
    this.setState((prevState) => {
      return {
        postForm: {
          ...prevState.postForm,
          [input]: {
            ...prevState.postForm[input],
            touched: true,
          },
        },
      };
    });
  };

  cancelPostChangeHandler = () => {
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
    });
    this.props.onCancelEdit();
  };

  acceptPostChangeHandler = () => {
    const post = {
      title: this.state.postForm.title.value,
      amount: this.state.postForm.amount.value,
      date: this.state.postForm.date.value,
    };
    console.log(post);
    this.props.onFinishEdit(post);
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
    });
  };

  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPostChangeHandler} />
        <Modal
          title="New Expense"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPostChangeHandler}
          onAcceptModal={this.acceptPostChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="title"
              label="Title"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "title")}
              valid={this.state.postForm["title"].valid}
              touched={this.state.postForm["title"].touched}
              value={this.state.postForm["title"].value}
            />
            <Input
              id="amount"
              label="Amount"
              control="input"
              type="number"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "amount")}
              valid={this.state.postForm["amount"].valid}
              touched={this.state.postForm["amount"].touched}
              value={this.state.postForm["amount"].value}
            />

            <Input
              id="date"
              label="Date"
              control="input"
              type="date"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "date")}
              valid={this.state.postForm["date"].valid}
              touched={this.state.postForm["date"].touched}
              value={this.state.postForm["date"].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default FeedEdit;
