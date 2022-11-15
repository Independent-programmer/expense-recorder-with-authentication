import React, { Component, Fragment } from "react";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Loader from "../../components/Loader/Loader";
import "./Feed.css";
import Expenses from "../../components/Expenses/Expenses";
import VideoModal from "./videoModal";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    postPage: 1,
    postsLoading: true,
    editLoading: false,
    page: 1,
    rowsPerPage: 5,
    year: "All",
    arr: [],
    uniqueArr: [],
  };

  componentDidMount() {
    //const { posts } = this.props;
    fetch("URL")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.year !== this.state.year) {
      this.loadPosts();
    }
    if (prevState.postPage !== this.state.postPage) {
      this.loadPosts();
    }
  }

  loadPosts = (direction) => {
    // console.log(year);
    console.log("direction", direction);
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    let year = this.state.year;
    console.log(year);

    fetch("http://localhost:8080/feed/posts?page=" + page + "&year=" + year, {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log("resData", resData);
        this.setState({
          posts: resData.posts.map((post) => {
            //console.log(post);
            return {
              ...post,
            };
          }),
          totalPosts: resData.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = { ...prevState.posts.find((p) => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    console.log(JSON.stringify(postData));
    this.setState({
      editLoading: true,
    });
    let url = "http://localhost:8080/feed/post";
    let method = "POST";
    if (this.state.editPost) {
      url = "http://localhost:8080/feed/post/" + this.state.editPost._id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      body: JSON.stringify(postData),
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          amount: resData.post.amount,
          date: resData.post.date,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt,
        };
        this.setState((prevState) => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              (p) => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else if (prevState.posts.length < 2) {
            updatedPosts = prevState.posts.concat(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });
    fetch("http://localhost:8080/feed/post/" + postId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState((prevState) => {
          const updatedPosts = prevState.posts.filter((p) => p._id !== postId);
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  deleteHandler = (id) => {
    console.log("id", id);
    this.deletePostHandler(id);
  };

  editHandler = (event) => {
    console.log(event);
    this.startEditPostHandler(event.id);
  };
  yearHandler = (year) => {
    console.log(year);
    this.setState({ year: year });
  };
  pageHandler = (page) => {
    console.log(page);
    this.setState({ postPage: page });
  };

  render() {
    return (
      <Fragment>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            Add new Expense
          </Button>
        </section>

        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No Expense found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Expenses
              items={this.state.posts}
              onStartEdit={this.editHandler}
              onDelete={this.deleteHandler}
              onSelectedYear={this.yearHandler}
              totalItems={this.state.totalPosts}
              token={this.props.token}
              onSelectedPage={this.pageHandler}
            />
          )}
        </section>
        <VideoModal />
      </Fragment>
    );
  }
}

export default Feed;
