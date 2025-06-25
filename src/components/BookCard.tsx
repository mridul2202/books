import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, DollarSign } from 'lucide-react';

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

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/book/${book.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        <div className="relative">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-amber-600 text-white px-2 py-1 rounded-full text-sm font-medium">
            ${book.price}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {book.genre}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{book.rating}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          
          <p className="text-gray-600 mb-3 font-medium">
            by {book.author}
          </p>
          
          <p className="text-gray-500 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{book.publishedYear}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-gray-900">{book.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;