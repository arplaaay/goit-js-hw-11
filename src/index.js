import axios from 'axios';
import Notiflix from 'notiflix';
import _ from 'lodash';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryMarkup from './image-gallery.hbs';

class NewsApiService {
    constructor() {
        this.page = 1;
        this.searchQuery = '';
    }

    async fetchImages() {
        try {
            const response = await axios.get(
                `${BASE_URL}?key=${API_KEY}&q=${this.query
                }&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}`,
            );
            this.incrementPage();
            return response.data;
        } catch (error) {
            onFetchError;
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    galleryItem: document.querySelector('.galleryItem'),
    galleryButton: document.querySelector('#galleryButton'),
};

const API_KEY = '24441832-e1f7ed32578d6107b72c2a05f';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 20;
const newsApiService = new NewsApiService();

refs.form.addEventListener('submit', onSubmitForm);
refs.gallery.addEventListener('click', onPhotoClick);
refs.galleryButton.addEventListener('click', onLoadMore);

function onSubmitForm(e) {
    e.preventDefault();

    newsApiService.resetPage();
    refs.gallery.innerHTML = '';
    newsApiService.query = e.currentTarget.elements.searchQuery.value;
    let response = newsApiService.fetchImages();
    response.then(renderImagesPreview);
}

function onLoadMore() {
    newsApiService.fetchImages().then(renderImagesPreview);
}

function onPhotoClick(e) {
    e.preventDefault();

    const isGalleryImageEl = e.target.classList.contains('galleryImage');

    if (!isGalleryImageEl) {
        return;
    }

    let gallery = new SimpleLightbox('.gallery a', {});

    gallery.on('show.simplelightbox', function () { });
}

function renderImagesPreview(response) {
    if (!response.total) {
        onFetchError();
        return;
    }

    const foundImages = response.hits;
    const markup = galleryMarkup(foundImages);

    refs.gallery.insertAdjacentHTML('beforeend', markup);
    refs.galleryButton.classList.remove('buttonHiden');
    refs.galleryButton.classList.add('buttonShown');
}

function onFetchError() {
    refs.gallery.innerHTML = '';
    Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
    );

    refs.galleryButton.classList.add('buttonHiden');
    refs.galleryButton.classList.remove('buttonShown');
}
