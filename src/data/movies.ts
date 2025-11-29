import { Movie } from '../types/Movie';

export const initialMovies: Movie[] = [
  {
    id: '1',
    title: 'Stranger Things',
    type: 'Série',
    rating: 9.8,
    synopsis: 'Stranger Things é uma série de ficção científica e terror dos anos 1980 que acompanha o desaparecimento de um garoto e os fenômenos sobrenaturais que afetam a cidade de Hawkins.',
    comments: [
      {
        id: '1',
        text: 'Essa série é incrível!',
        timestamp: Date.now() - 86400000,
      },
      {
        id: '2',
        text: 'Ansioso pela nova aventura com a 11 em Hawkins',
        timestamp: Date.now() - 172800000,
      },
    ],
    image: 'assets/imagens/stranger.jpg',
    watched: false,
  },
  {
    id: '2',
    title: 'Vingadores: Ultimato',
    type: 'Filme',
    rating: 9.2,
    synopsis: 'Os Vingadores enfrentam Thanos em uma épica batalha final.',
    comments: [],
    image: 'https://via.placeholder.com/300x400?text=Vingadores',
    watched: false,
  },
  {
    id: '3',
    title: 'Alita: Anjo de Combate',
    type: 'Filme',
    rating: 8.5,
    synopsis: 'Uma ciborgue amnésica descobre sua verdadeira natureza em uma metrópole futurista.',
    comments: [],
    image: 'assets/imagens/alita.jpg',
    watched: false,
  },
];