export interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

export interface Movie {
  id: string;
  title: string;
  type: 'Filme' | 'Série';
  rating: number;
  synopsis: string;
  comments: Comment[];
  image: string;
  watched: boolean;
}