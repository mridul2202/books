import React, { useState, useEffect } from 'react';
import { Book, TrendingUp, Users, Award } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookFilters from '../components/BookFilters';
import { bookService } from '../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  publishedYear: number;
  rating: number;
  image: string;
  description: string;
}

interface HomePageProps {
  searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedGenre, selectedAuthor, minPrice, maxPrice]);

  const fetchData = async () => {
    try {
      const [genresData, authorsData] = await Promise.all([
        bookService.getGenres(),
        bookService.getAuthors()
      ]);
      setGenres(genresData);
      setAuthors(authorsData);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedAuthor) params.append('author', selectedAuthor);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const data = await bookService.getBooks(params.toString());
      setBooks(data.books);
      setError('');
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedAuthor('');
    setMinPrice('');
    setMaxPrice('');
  };

  const stats = [
    { icon: Book, label: 'Total Books', value: '22+', color: 'text-blue-600' },
    { icon: Users, label: 'Happy Readers', value: '1000+', color: 'text-green-600' },
    { icon: Award, label: 'Award Winners', value: '15+', color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Bestsellers', value: '8+', color: 'text-orange-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Great Read
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore our carefully curated collection of timeless classics, modern bestsellers, and hidden gems
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 inline-flex">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg px-6 py-3">
                  <span className="text-white font-semibold">📚 Free Shipping on Orders $25+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Book Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From literary classics to contemporary favorites, find your perfect book
            </p>
          </div>

          <BookFilters
            genres={genres}
            authors={authors}
            selectedGenre={selectedGenre}
            selectedAuthor={selectedAuthor}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onGenreChange={setSelectedGenre}
            onAuthorChange={setSelectedAuthor}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onClearFilters={clearFilters}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {books.length === 0 ? (
            <div className="text-center py-16">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;