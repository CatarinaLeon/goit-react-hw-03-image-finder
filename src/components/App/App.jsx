import { Component } from "react";
import Searchbar from "../Searchbar/Searchbar";
import ImageGallery from "../ImageGallery/ImageGallery";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import api from "../services/api";
import s from "./App.module.css";

class App extends Component {
  state = {
    curretPage: 1,
    gallery: [],
    searchQuery: "",
    loading: false,
    showModal: false,
    largeImageUrl: "",
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImagesGallery();
    }
  }

  fetchImagesGallery = () => {
    const { currentPage, searchQuery } = this.state;
    this.setState({ loading: true });
    api
      .fetchImages(searchQuery, currentPage)
      .then((data) =>
        this.setState((prevState) => ({
          gallery: [...prevState.gallery, ...data.hits],
          currentPage: prevState.currentPage + 1,
        }))
      )
      // .then(() => {
      //   window.scrollTo({
      //     top: document.documentElement.scrollHeight,
      //     behavior: "smooth",
      //   });
      // })
      .catch((error) => this.setState({ error }))
      .finally(() => this.setState({ loading: false }));
  };

  handleQueryChange = (query) => {
    this.setState({ gallery: [], searchQuery: query, currentPage: 1 });
  };

  openModal = (event) => {
    if (event.target.nodeName === "IMG") {
      this.setState({
        showModal: true,
        largeImageUrl: event.target.dataset.source,
      });
    }
  };

  closeModal = () => {
    this.setState({ showModal: false, largeImageUrl: "" });
  };

  render() {
    const {
      gallery,
      searchQuery,
      currentPage,
      showModal,
      largeImageUrl,
      loading,
    } = this.state;

    return (
      <div className={s.App}>
        <Searchbar onSubmit={this.handleQueryChange} />
        <ImageGallery
          gallery={gallery}
          searchQuery={searchQuery}
          currentPage={currentPage}
          onClick={this.openModal}
        />
        {showModal && (
          <Modal onClose={this.closeModal} largeImageURL={largeImageUrl}>
            <img src={largeImageUrl} alt="" />
          </Modal>
        )}
        {loading && <Loader />}
        {gallery.length > 0 && !loading && (
          <Button onClick={this.fetchImagesGallery} />
        )}
      </div>
    );
  }
}

export default App;
