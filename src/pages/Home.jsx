import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Clock, 
  Star, 
  Truck, 
  Shield, 
  Utensils,
  MapPin,
  ChefHat,
  Smartphone,
  CreditCard
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const featuredRestaurants = [
    {
      id: 1,
      name: "Mario's Italian Kitchen",
      image: "/images/italian-restaurant.jpg",
      rating: 4.8,
      deliveryTime: "25-35 min",
      deliveryFee: 2.99,
      cuisine: "Italian",
      featured: true
    },
    {
      id: 2,
      name: "Dragon Palace",
      image: "/images/chinese-restaurant.jpg",
      rating: 4.6,
      deliveryTime: "30-40 min",
      deliveryFee: 1.99,
      cuisine: "Chinese",
      featured: true
    },
    {
      id: 3,
      name: "Burger Junction",
      image: "/images/american-restaurant.jpg",
      rating: 4.7,
      deliveryTime: "20-30 min",
      deliveryFee: 3.49,
      cuisine: "American",
      featured: true
    }
  ];

  const cuisineTypes = [
    { name: "Italian", icon: "🍝", count: 45 },
    { name: "Chinese", icon: "🥡", count: 38 },
    { name: "Mexican", icon: "🌮", count: 32 },
    { name: "Indian", icon: "🍛", count: 28 },
    { name: "American", icon: "🍔", count: 52 },
    { name: "Thai", icon: "🍜", count: 24 }
  ];

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Fast Delivery",
      description: "Get your food delivered in 30 minutes or less"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Safe & Secure",
      description: "Secure payments and contactless delivery options"
    },
    {
      icon: <Utensils className="h-8 w-8 text-primary" />,
      title: "Quality Food",
      description: "Fresh ingredients and top-rated restaurants"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Easy Ordering",
      description: "Simple and intuitive ordering process"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Delicious Food
              <span className="text-primary block">Delivered Fast</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep in minutes.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter your address to find restaurants"
                  className="pl-10 pr-4 py-3 text-base"
                />
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => navigate('/restaurants')}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Available in 50+ cities</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free delivery on orders $25+</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Average delivery: 28 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Cuisine</h2>
            <p className="text-muted-foreground">Discover restaurants serving your favorite dishes</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cuisineTypes.map((cuisine, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/restaurants?cuisine=${cuisine.name.toLowerCase()}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{cuisine.icon}</div>
                  <h3 className="font-semibold mb-1">{cuisine.name}</h3>
                  <p className="text-sm text-muted-foreground">{cuisine.count} restaurants</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Restaurants</h2>
              <p className="text-muted-foreground">Top-rated restaurants in your area</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/restaurants')}>
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              >
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {restaurant.featured && (
                    <Badge className="absolute top-2 left-2">Featured</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{restaurant.cuisine}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>${restaurant.deliveryFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose FoodieExpress?</h2>
            <p className="text-muted-foreground">We make food delivery simple, fast, and reliable</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Order?</h2>
            <p className="text-lg opacity-90">
              Join thousands of satisfied customers and get your favorite food delivered today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/restaurants')}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Browse Restaurants
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate('/register')}
              >
                <ChefHat className="mr-2 h-5 w-5" />
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

