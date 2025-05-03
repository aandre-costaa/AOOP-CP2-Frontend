<script setup>
  import {ref, onMounted, reactive} from 'vue';
  import { useRoute } from 'vue-router';
  import EditMovieModal from "@/components/EditMovieModal.vue";

  // Reactive state variables
  const loading = ref(false);
  const movieDetail = ref(null);
  const comments = ref([]);

  // Movie ID from URL or passed prop
  const route = useRoute();
  const movieId = route.params.id;

  const apiUrl = import.meta.env.VITE_API_URL;

  const comment = reactive({
    name: '',
    email: '',
    text: ''
  });

  // Show loading indicator
  function showLoading() {
    loading.value = true;
  }

  // Hide loading indicator
  function hideLoading() {
    loading.value = false;
  }

  // Fetch movie details and comments
  async function fetchMovieDetails() {
    if (movieId) {
      showLoading();

      try {
        // Fetch movie details
        const movieResponse = await fetch(`${apiUrl}/${movieId}`);
        const movie = await movieResponse.json();
        movieDetail.value = movie;

        // Fetch movie comments
        comments.value = Array.isArray(movie.comments) ? movie.comments : [];

      } catch (err) {
        console.error('Error loading movie details or comments:', err);
      } finally {
        hideLoading();
      }
    }
  }

  async function submitComment() {
    try {
      const payload = {
        ...comment,
        movie_id: movieId
      };

      const res = await fetch(`${apiUrl}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit comment');

      alert('Comment submitted!');
      comment.name = '';
      comment.email = '';
      comment.text = '';
      fetchMovieDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to submit comment.');
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`${apiUrl}/comment/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
        fetchMovieDetails();
      } else {
        console.error('Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const showUpdateModal = ref(false);
  const selectedMovie = ref(null);

  function openUpdateModal(movie) {
    selectedMovie.value = movie;
    showUpdateModal.value = true;
  }

  // On mount, fetch movie details and comments
  onMounted(fetchMovieDetails);
</script>

<template>
  <div id="loading" v-if="loading" style="text-align: center; padding: 2rem;">
    <p>Loading...</p>
  </div>

  <div class="movie-detail-page" v-if="!loading">
    <div id="movieDetail" class="movie-detail">
      <div class="container">
        <div class="poster-section">
          <img :src="movieDetail?.poster || 'https://via.placeholder.com/300x450'"
               :alt="movieDetail?.title || 'No Title'">
        </div>
        <div class="info-section">
          <h1>{{ movieDetail?.title || 'Untitled' }}
            <span class="year">({{ movieDetail?.year || 'Unknown Year' }})</span>
          </h1>
          <p class="genres">
            <span v-for="genre in movieDetail?.genres || []" :key="genre">{{ genre }}</span>
            <span v-if="!movieDetail?.genres?.length">No Genres</span>
          </p>
          <p><strong>Directed by:</strong> {{ movieDetail?.directors?.join(', ') || 'Unknown Directors' }}</p>
          <p><strong>Writers:</strong> {{ movieDetail?.writers?.join(', ') || 'Unknown Writers' }}</p>
          <p><strong>Cast:</strong> {{ movieDetail?.cast?.join(', ') || 'Unknown Cast' }}</p>
          <p><strong>Languages:</strong> {{ movieDetail?.languages?.join(', ') || 'Unknown Languages' }}</p>
          <p><strong>Country:</strong> {{ movieDetail?.countries?.join(', ') || 'Unknown Country' }}</p>
          <p><strong>Runtime:</strong> {{ movieDetail?.runtime || 'Unknown Runtime' }} minutes</p>
          <p><strong>IMDb Rating:</strong> {{ movieDetail?.imdb?.rating || 'N/A' }}
            ({{ movieDetail?.imdb?.votes || '0' }} votes)
          </p>
          <p><strong>Awards:</strong> {{ movieDetail?.awards?.text || 'No Awards' }}</p>
          <p><strong>Plot:</strong> {{ movieDetail?.plot || 'No Plot Available' }}</p>
          <p><strong>Full Plot:</strong> {{ movieDetail?.fullplot || 'No Full Plot Available' }}</p>
          <button class="edit-btn" @click="openUpdateModal(movieDetail)">Edit informations</button>
        </div>
      </div>
    </div>

    <div class="comments-section">
      <h3><strong>Comments:</strong></h3>
      <form class="create-comment" @submit.prevent="submitComment">
        <label class="name">Name:
          <input v-model="comment.name" required />
        </label>
        <label class="email">Email:
          <input v-model="comment.email" required type="email" />
        </label>
        <label class="comment-input">Comment:
          <textarea v-model="comment.text" rows="4" required></textarea>
        </label>
        <button type="submit" class="comment-btn">Comment</button>
      </form>
      <div v-if="comments.length === 0">
        <p style="color: black">No comments available</p>
      </div>
      <div style="width: 100%" v-else>
        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <p><strong>{{ comment.name }} ({{comment.email}})</strong> <span class="date">{{ new Date(comment.date).toLocaleDateString() }}</span></p>
          <p class="text">{{ comment.text }}</p>
          <button class="delete-btn" @click="deleteComment(comment._id)"></button>
        </div>
      </div>
    </div>
  </div>
  <EditMovieModal v-if="showUpdateModal" :movie="selectedMovie" @cancel="showUpdateModal = false" @update="fetchMovieDetails"/>
</template>


<style scoped>
  .movie-detail-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 184px;
  }

  .movie-detail {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    color: #AA1414;
    height: 100%;
    width: 80%;
    box-sizing: border-box;
  }

  .container {
    display: flex;
    gap: 40px;
    width: 100%;
    height: 100%;
    background: black;
    box-shadow: 0 4px 4px 0 rgba(34, 34, 34, 0.25);
    border-radius: 64px;
    overflow: hidden;
    padding: 32px;
  }

  h1, p  {
    color: white;
  }

  .poster-section img {
    width: 300px;
    height: auto;
    object-fit: cover;
    border-radius: 32px;
    display: block;
  }

  .info-section {
    padding: 32px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .year {
    font-weight: normal;
    font-size: 0.8em;
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

  p {
    margin: 8px 0;
  }

  strong {
    font-family: "Orbitron", sans-serif;
    font-weight: 700;
    color: #AA1414;
  }

  .edit-btn {
    background: #AA1414;
    color: white;
    border: none;
    padding: 8px 32px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 16px;
    height: 48px;
    width: fit-content;
    transition: all 0.3s linear;
    align-self: end;
  }

  .edit-btn:hover {
    color: #AA1414;
    background: white;
    scale: 1.05
  }

  .comments-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: 32px 0 16px 0;
  }

  .comment {
    background: black;
    border-radius: 32px;
    padding: 16px;
    width: 100%;
    margin-top: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }

  .comment:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px #AA1414;
  }

  .comment .date {
    font-size: 0.85em;
    color: white;
    margin-left: 0.5em;
  }

  .comment:last-child {
    border-bottom: none;
  }

  .comment .delete-btn {
    background-image: url("./icons/trash-icon.svg");
    background-size: 32px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #AA1414;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s linear;
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .comment .delete-btn:hover {
    color: #AA1414;
    scale: 1.05
  }

  .create-comment {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 16px;
    width: 100%;
    margin: 8px;
  }

  .create-comment .name, .create-comment .email, .create-comment .comment-input {
    display: block;
    font-family: "Orbitron", sans-serif;
    font-weight: 700;
    color: #AA1414;
    font-size: 16px;
  }

  .create-comment .name, .create-comment .email {
    width: calc(50% - 8px);
  }

  .create-comment .comment-input {
    width: 100%;
  }

  .create-comment input, .create-comment textarea {
    width: 100%;
  }

  textarea {
    resize: vertical;
  }

  input, textarea {
    width: 100%;
    min-height: 32px;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid black;
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
  }

  .create-comment .comment-btn {
    background: #AA1414;
    color: white;
    border: none;
    padding: 8px 32px;
    cursor: pointer;
    border-radius: 16px;
    height: 48px;
    width: fit-content;
    transition: all 0.3s linear;
    align-self: end;
  }

  .create-comment .comment-btn:hover {
    color: #AA1414;
    background: white;
    scale: 1.05
  }
</style>