<script setup>
  import { reactive, watch } from 'vue';
  const props = defineProps({ movie: Object });
  const emit = defineEmits(['cancel', 'update']);
  import { ref } from 'vue';

  async function updateMovie(data) {
    try {
      const { _id, ...movieData } = data;

      const response = await fetch(`http://localhost:3000/movies/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
      });

      if (!response.ok) throw new Error('Failed to update movie');

      const updatedMovie = await response.json();
      console.log('Movie updated:', updatedMovie);
      emit("cancel");
      emit('update');
    } catch (err) {
      console.error(err);
    }
  }


  const form = reactive({
    title: '',
    year: '',
    genres: '',
    directors: '',
    writers: '',
    cast: '',
    languages: '',
    countries: '',
    runtime: '',
    imdb: { rating: '', votes: '' },
    awards: { text: '' },
    plot: '',
    fullplot: '',
    poster: ''
  });

  // Populate form when movie prop changes
  watch(() => props.movie, (newVal) => {
    if (newVal) {
      Object.assign(form, {
        _id: newVal._id || '',
        title: newVal.title || '',
        year: newVal.year || '',
        genres: (newVal.genres || []).join(', '),
        directors: (newVal.directors || []).join(', '),
        writers: (newVal.writers || []).join(', '),
        cast: (newVal.cast || []).join(', '),
        languages: (newVal.languages || []).join(', '),
        countries: (newVal.countries || []).join(', '),
        runtime: newVal.runtime || '',
        imdb: {
          rating: newVal.imdb?.rating || '',
          votes: newVal.imdb?.votes || ''
        },
        awards: {
          text: newVal.awards?.text || ''
        },
        plot: newVal.plot || '',
        fullplot: newVal.fullplot || '',
        poster: newVal.poster || ''
      });
    }
  }, { immediate: true });

  function submitUpdate() {
    updateMovie({
      _id: props.movie._id,
      ...form,
      genres: form.genres.split(',').map(g => g.trim()),
      directors: form.directors.split(',').map(d => d.trim()),
      writers: form.writers.split(',').map(w => w.trim()),
      cast: form.cast.split(',').map(c => c.trim()),
      languages: form.languages.split(',').map(l => l.trim()),
      countries: form.countries.split(',').map(c => c.trim())
    });
  }
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 style="color: black">Edit Movie</h2>

      <form @submit.prevent="submitUpdate">
        <label>Title:
          <input v-model="form.title" required />
        </label>

        <label>Year:
          <input type="number" v-model="form.year" required />
        </label>

        <label>Genres (comma-separated):
          <input v-model="form.genres" />
        </label>

        <label>Directors (comma-separated):
          <input v-model="form.directors" />
        </label>

        <label>Writers (comma-separated):
          <input v-model="form.writers" />
        </label>

        <label>Cast (comma-separated):
          <input v-model="form.cast" />
        </label>

        <label>Languages (comma-separated):
          <input v-model="form.languages" />
        </label>

        <label>Countries (comma-separated):
          <input v-model="form.countries" />
        </label>

        <label>Runtime (minutes):
          <input type="number" v-model="form.runtime" />
        </label>

        <label>IMDb Rating:
          <input type="number" step="0.1" v-model="form.imdb.rating" />
        </label>

        <label>IMDb Votes:
          <input type="number" v-model="form.imdb.votes" />
        </label>

        <label>Awards Text:
          <input v-model="form.awards.text" />
        </label>

        <label>Plot:
          <textarea v-model="form.plot" rows="3" />
        </label>

        <label>Full Plot:
          <textarea v-model="form.fullplot" rows="4" />
        </label>

        <label>Poster URL:
          <input v-model="form.poster" />
        </label>

        <div class="actions">
          <button type="button" @click="$emit('cancel')" class="cancel-btn">Cancel</button>
          <button type="submit" class="update-btn">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 32px;
    width: 100%;
    max-width: 800px;
    margin: 64px;
    max-height: 90vh;
    overflow-y: scroll;
    scrollbar-width: none;
  }

  label {
    display: block;
    margin: 12px 0 6px;
    font-family: "Orbitron", sans-serif;
    font-weight: 700;
    color: #AA1414;
    font-size: 16px;
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

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }

  .update-btn {
    background: #d3d3d3;
    color: #AA1414;
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

  .update-btn:hover {
    background: #52a600;
    color: white;
    scale: 1.05
  }

  .cancel-btn {
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

  .cancel-btn:hover {
    color: #AA1414;
    background: #6a0808;
    scale: 1.05
  }

</style>