<script setup>
  import { ref, onMounted } from 'vue';

  const loading = ref(false);
  const page = ref(1);
  const totalPages = ref(1);
  const movies = ref([]);
  const searchQuery = ref('');
  const apiUrl = import.meta.env.VITE_API_URL;

  async function fetchMovies() {
    loading.value = true;
    try {
      const res = await fetch(`${apiUrl}?page=${page.value}&title=${searchQuery.value}`);
      const data = await res.json();
      movies.value = data.movies;
      totalPages.value = data.totalPages;
    } catch (err) {
      console.error('Error loading movies:', err);
    } finally {
      loading.value = false;
    }
  }

  function searchMovies() {
    page.value = 1;
    fetchMovies();
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--;
      fetchMovies();
    }
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++;
      fetchMovies();
    }
  }

  // Fetch movies when the component mounts
  onMounted(fetchMovies);

  // Handle broken urls
  const fallbackImage = 'https://www.ratio-electric.com/media/products/notfound.png';
  function handleImageError(event) {
    event.target.src = fallbackImage;
  }
</script>

<template>
  <div id="loading" v-if="loading" style="text-align: center; padding: 2rem;">
    <p>Loading...</p>
  </div>

  <div class="main-page" v-else>
    <div class="main-page-header">
      <input type="text" v-model="searchQuery" placeholder="Search movies" class="search-bar" @keydown.enter="searchMovies"/>
      <button type="button" class="search-btn" @click="searchMovies">Search</button>
    </div>

    <div class="movie-grid">
      <div id="movieList" class="movie-list">
        <div v-for="movie in movies" :key="movie._id" class="movie-card">
          <img
              :src="movie.poster || fallbackImage"
              :alt="movie.title || 'No Title'"
              @error="handleImageError($event)"
          />
          <div class="card-info">
            <h2>{{ movie.title || 'N/A' }}</h2>
            <p class="year">{{ movie.year || 'Unknown Year' }}</p>
            <p class="genres">
              <span v-for="genre in movie.genres || []" :key="genre">{{ genre }}</span>
            </p>
            <p class="desc">{{ movie.plot || 'No Description Available' }}</p>
            <router-link class="details-btn" :to="`/movie-details/${movie._id || ''}`">View Details</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Section -->
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <h3>Page: {{ page }}</h3>
      <button @click="nextPage" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>



<style scoped>
  .main-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 184px;
  }

  .main-page-header {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 16px;
  }

  .main-page-header input {
    width: 400px;
    height: 48px;
    border-radius: 16px;
    padding: 8px 48px;
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: 16px;
    background: url("./icons/Search_Magnifying_Glass.svg") 8px no-repeat;
    border: 2px black solid;
    box-shadow: 0 2px 2px 0 rgba(34, 34, 34, 0.25);
    transition: all 0.2s ease;
  }

  .main-page-header input:hover, .main-page-header input:focus {
    transform: scale(1.02);
    box-shadow: 0 0 10px #AA1414;
  }

  .main-page-header button {
    background: #AA1414;
    color: white;
    border: none;
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 16px;
    width: 128px;
    height: 48px;
    transition: all 0.3s linear;
  }

  .main-page-header button:hover {
    color: #AA1414;
    background: white;
    scale: 1.1
  }

  .movie-grid {
    display: flex;
    justify-content: center;
    width: 80%;
  }

  .movie-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 40px 20px;
    width: 100%;
  }

  .movie-card {
    display: flex;
    gap: 20px;
    background: black;
    border-radius: 32px;
    overflow: hidden;
    padding: 16px;
    height: 300px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .movie-card:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px #AA1414;
  }

  .movie-card img {
    width: 180px;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    flex-shrink: 0;
    object-position: center;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .card-info h2 {
    color: #AA1414;
    margin: 0;
  }

  .card-info .year {
    color: white;
    margin-bottom: 10px;
  }

  .card-info .desc {
    margin: 10px 0;
    color: white;
  }

  .genres {
    display: flex;
    gap: 8px;
  }

  .genres span {
    background: #AA1414;
    color: white;
    padding: 2px 8px;
    border-radius: 8px;
  }

  .details-btn {
    background: #AA1414;
    color: #fff;
    font-family: "Orbitron", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    font-size: 16px;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 16px;
    transition: all 0.3s linear;
    align-self: end;
  }

  .details-btn:hover {
    color: #AA1414;
    background: white;
    scale: 1.1
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin-bottom: 16px;
    gap: 16px;
  }

  .pagination h3 {
    color: black;
  }

  .pagination button {
    background: #AA1414;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 16px;
    width: 128px;
    height: 48px;
    transition: all 0.3s linear;
  }

  .pagination button:hover {
    color: #AA1414;
    background: white;
    scale: 1.1
  }

  .pagination button:disabled {
    background: #434242;
  }

  .pagination button:hover:disabled {
    background: #434242;
    color: white;
    scale: 1;
    cursor: not-allowed;
  }
</style>