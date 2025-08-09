import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Truck, 
  MapPin, 
  Heart,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';

const RestaurantList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    priceRange: [0, 50],
    rating: 0,
    deliveryTime: 60,
    freeDelivery: false,
    openNow: false
  });
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Mock restaurant data - in real app this would come from API
  const [restaurants] = useState([
    {
      id: 1,
      name: "Mario's Italian Kitchen",
      image: "/images/italian-restaurant.jpg",
      rating: 4.8,
      reviewCount: 324,
      deliveryTime: "25-35 min",
      deliveryFee: 2.99,
      cuisine: "Italian",
      priceRange: "$$",
      distance: "1.2 km",
      featured: true,
      openNow: true,
      freeDelivery: false,
      description: "Authentic Italian cuisine with fresh pasta and wood-fired pizzas",
      tags: ["Pizza", "Pasta", "Italian", "Family-friendly"]
    },
    {
      id: 2,
      name: "Dragon Palace",
      image: "/images/chinese-restaurant.jpg",
      rating: 4.6,
      reviewCount: 189,
      deliveryTime: "30-40 min",
      deliveryFee: 1.99,
      cuisine: "Chinese",
      priceRange: "$",
      distance: "2.1 km",
      featured: true,
      openNow: true,
      freeDelivery: true,
      description: "Traditional Chinese dishes with modern presentation",
      tags: ["Chinese", "Dim Sum", "Noodles", "Vegetarian Options"]
    },
    {
      id: 3,
      name: "Burger Junction",
      image: "/images/american-restaurant.jpg",
      rating: 4.7,
      reviewCount: 456,
      deliveryTime: "20-30 min",
      deliveryFee: 3.49,
      cuisine: "American",
      priceRange: "$$",
      distance: "0.8 km",
      featured: false,
      openNow: true,
      freeDelivery: false,
      description: "Gourmet burgers made with premium ingredients",
      tags: ["Burgers", "American", "Fast Food", "Milkshakes"]
    },
    {
      id: 4,
      name: "Spice Garden",
      image: "/images/indian-restaurant.jpg",
      rating: 4.5,
      reviewCount: 267,
      deliveryTime: "35-45 min",
      deliveryFee: 2.49,
      cuisine: "Indian",
      priceRange: "$$",
      distance: "3.2 km",
      featured: false,
      openNow: false,
      freeDelivery: true,
      description: "Authentic Indian flavors with aromatic spices",
      tags: ["Indian", "Curry", "Vegetarian", "Spicy"]
    },
    {
      id: 5,
      name: "Taco Fiesta",
      image: "/images/mexican-restaurant.jpg",
      rating: 4.4,
      reviewCount: 198,
      deliveryTime: "25-35 min",
      deliveryFee: 1.99,
      cuisine: "Mexican",
      priceRange: "$",
      distance: "1.8 km",
      featured: false,
      openNow: true,
      freeDelivery: false,
      description: "Fresh Mexican street food and traditional favorites",
      tags: ["Mexican", "Tacos", "Burritos", "Fresh"]
    },
    {
      id: 6,
      name: "Sushi Zen",
      image: "/images/japanese-restaurant.jpg",
      rating: 4.9,
      reviewCount: 412,
      deliveryTime: "40-50 min",
      deliveryFee: 4.99,
      cuisine: "Japanese",
      priceRange: "$$$",
      distance: "2.7 km",
      featured: true,
      openNow: true,
      freeDelivery: false,
      description: "Premium sushi and Japanese cuisine",
      tags: ["Sushi", "Japanese", "Fresh Fish", "Premium"]
    }
  ]);

  const cuisineTypes = [
    "All", "Italian", "Chinese", "American", "Indian", "Mexican", "Japanese", "Thai", "Mediterranean"
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.search && !restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !restaurant.cuisine.toLowerCase().includes(filters.search.toLowerCase()) &&
        !restaurant.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }
    
    if (filters.cuisine && filters.cuisine !== "All" && restaurant.cuisine !== filters.cuisine) {
      return false;
    }
    
    if (restaurant.rating < filters.rating) {
      return false;
    }
    
    const deliveryTimeNum = parseInt(restaurant.deliveryTime.split('-')[1]);
    if (deliveryTimeNum > filters.deliveryTime) {
      return false;
    }
    
    if (filters.freeDelivery && !restaurant.freeDelivery) {
      return false;
    }
    
    if (filters.openNow && !restaurant.openNow) {
      return false;
    }
    
    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deliveryTime':
        return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
      case 'deliveryFee':
        return a.deliveryFee - b.deliveryFee;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return 0;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      priceRange: [0, 50],
      rating: 0,
      deliveryTime: 60,
      freeDelivery: false,
      openNow: false
    });
    setSearchParams({});
  };

  const RestaurantCard = ({ restaurant, isListView = false }) => (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden ${
        isListView ? 'flex flex-row' : ''
      }`}
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
    >
      <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : 'aspect-video'}`}>
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.featured && (
          <Badge className="absolute top-2 left-2">Featured</Badge>
        )}
        {!restaurant.openNow && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Closed</Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite toggle
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
            <p className="text-muted-foreground text-sm">{restaurant.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
            <span className="text-xs text-muted-foreground">({restaurant.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>{restaurant.freeDelivery ? 'Free' : `$${restaurant.deliveryFee}`}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{restaurant.distance}</span>
            </div>
          </div>
          <Badge variant="outline">{restaurant.priceRange}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
        <p className="text-muted-foreground">
          Discover amazing restaurants in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search restaurants, cuisines, or dishes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Cuisine</label>
                <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange('cuisine', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cuisines" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map(cuisine => (
                      <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Rating: {filters.rating}★
                </label>
                <Slider
                  value={[filters.rating]}
                  onValueChange={(value) => handleFilterChange('rating', value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Delivery Time: {filters.deliveryTime} min
                </label>
                <Slider
                  value={[filters.deliveryTime]}
                  onValueChange={(value) => handleFilterChange('deliveryTime', value[0])}
                  max={60}
                  min={15}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freeDelivery"
                    checked={filters.freeDelivery}
                    onCheckedChange={(checked) => handleFilterChange('freeDelivery', checked)}
                  />
                  <label htmlFor="freeDelivery" className="text-sm">Free delivery</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openNow"
                    checked={filters.openNow}
                    onCheckedChange={(checked) => handleFilterChange('openNow', checked)}
                  />
                  <label htmlFor="openNow" className="text-sm">Open now</label>
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="deliveryTime">Delivery Time</SelectItem>
              <SelectItem value="deliveryFee">Delivery Fee</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid/List */}
      {sortedRestaurants.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {sortedRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              isListView={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;

