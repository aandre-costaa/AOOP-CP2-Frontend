import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './components/MainPage.vue'
import MovieDetails from './components/MovieDetailsPage.vue'

const routes = [
    { path: '/', name: 'MainPage', component: MainPage },
    { path: '/movie-details/:id', name: 'MovieDetails', component: MovieDetails }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router