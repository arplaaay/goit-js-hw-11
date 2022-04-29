import Notiflix from 'notiflix';
import _ from 'lodash';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryMarkup from './image-gallery.hbs';
import NewsApiService from './templates/api-service';

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector('.gallery'),
    galleryItem: document.querySelector('.galleryItem'),
    galleryButton: document.querySelector('#galleryButton'),
};

refs.form.addEventListener('submit', onSubmitForm);
refs.gallery.addEventListener('click', onPhotoClick);
refs.galleryButton.addEventListener('click', onLoadMore);

const newsApiService = new NewsApiService();

function onSubmitForm(e) {
    e.preventDefault();

    newsApiService.resetPage();
    refs.gallery.innerHTML = '';
    newsApiService.query = e.currentTarget.elements.searchQuery.value;

    const elements = e.currentTarget.elements;

    if (elements.searchQuery.value.length > 1) {
        let response = newsApiService.fetchImages();
        response.then(renderImagesPreview);
    } else {
        Notiflix.Notify.info("Please, enter something to find.");
        refs.galleryButton.remove();
    }
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
