import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export interface Directors {
  movieId: number
  personId: number
}

export interface Movies {
  id: Generated<number>
  title: string
  year: number | null
}

export interface People {
  id: Generated<number>
  name: string
  birth: number | null
}

export interface Ratings {
  movieId: number
  rating: number
  votes: number
}

export interface Screenings {
  id: Generated<number>
  movieId: number
  screeningTime: string
  totalTickets: number
  ticketsLeft: number
}

export interface Stars {
  movieId: number
  personId: number
}

export interface Tickets {
  id: Generated<number>
  screeningId: number
  userId: number
  bookingTime: string
}

export interface Users {
  id: Generated<number>
  name: string
}

export interface DB {
  directors: Directors
  movies: Movies
  people: People
  ratings: Ratings
  screenings: Screenings
  stars: Stars
  tickets: Tickets
  users: Users
}
