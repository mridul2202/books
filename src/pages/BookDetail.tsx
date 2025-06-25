import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Book, DollarSign, Globe, Package } from 'lucide-react';
import { bookService } from '../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  price: number;
  description: string;
  pages: number;
  publisher: string;
  language: string;
  rating: number;
  stock: number;
  image: string;
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchBook(parseInt(id));
    }
  }, [id]);

  const fetchBook = async (bookId: number) => {
    try {
      setLoading(true);
      const data = await bookService.getBook(bookId);
      setBook(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch book details');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The book you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Books</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {book.genre}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold">{book.rating}</span>
                      <span className="text-gray-500">/5</span>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    by <span className="font-semibold">{book.author}</span>
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{book.publishedYear}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Book className="h-4 w-4" />
                      <span>{book.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{book.language}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>

                {/* Book Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Book Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ISBN:</span>
                        <span className="font-medium">{book.isbn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publisher:</span>
                        <span className="font-medium">{book.publisher}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{book.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pages:</span>
                        <span className="font-medium">{book.pages}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium">New</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">Free on orders $25+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-6 w-6 text-gray-600" />
                      <span className="text-3xl font-bold text-gray-900">{book.price}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        disabled={book.stock === 0}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                          book.stock > 0
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button className="px-8 py-3 border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-colors">
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;