import axios from 'axios';

const API_KEY = '24441832-e1f7ed32578d6107b72c2a05f';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 20;


export default class NewsApiService {
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