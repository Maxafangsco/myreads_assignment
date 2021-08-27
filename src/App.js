import React,{Component} from "react";
import { Switch, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import BooksList from "./components/BooksList";
import SearchBooks from "./components/SearchBooks";

class BooksApp extends Component {
  state = {
    myBooks: [],
    errorMessage: "You don't have any books in this shelf",
    fetchingError: undefined,
    isFetchingBooks: true
  };
  componentDidMount() {
    this.fetchMyBooks();
  }
  fetchMyBooks = () => {
    this.setState({
      isFetchingBooks: true
    });
    BooksAPI.getAll()
      .then(books => {
        if (!books.length) {
          this.setState({
            fetchingError: undefined,
            isFetchingBooks: false
          });
        } else {
          this.setState({
            myBooks: books,
            fetchingError: undefined,
            isFetchingBooks: false
          });
        }
      })
      .catch(err => {
        this.setState({
          fetchingError:
            "There was an error loading your books, please check your connection",
          isFetchingBooks: false
        });
      });
  };
  changeBookShelf = (book, shelf) => {
    book.shelf = shelf;
    this.setState(prevState => ({
      myBooks: prevState.myBooks.filter(b => b.id !== book.id).concat([book])
    }));
    BooksAPI.update(book, shelf);
  };
  render() {
    const { myBooks, errorMessage, fetchingError, isFetchingBooks } = this.state;
    const { changeBookShelf, fetchMyBooks } = this;
    return (
      <div className="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <BooksList
                fetchingError={fetchingError}
                myBooks={myBooks}
                changeBookShelf={changeBookShelf}
                error={errorMessage}
                fetchMyBooks={fetchMyBooks}
                isFetchingBooks={isFetchingBooks}
              />
            )}
          />
          <Route
            path="/search"
            render={() => (
              <SearchBooks
                myBooks={myBooks}
                changeBookShelf={changeBookShelf}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default BooksApp;
