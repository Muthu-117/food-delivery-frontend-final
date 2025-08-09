import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Clock, 
  Truck, 
  MapPin, 
  Heart,
  Phone,
  Globe,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Info,
  Users,
  Award,
  Utensils
} from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');

  // Mock restaurant data - in real app this would come from API
  const restaurant = {
    id: 1,
    name: "Mario's Italian Kitchen",
    image: "/api/placeholder/800/400",
    gallery: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    cuisine: "Italian",
    priceRange: "$$",
    distance: "1.2 km",
    openNow: true,
    openingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM"
    },
    description: "Authentic Italian cuisine with fresh pasta and wood-fired pizzas. Family-owned restaurant serving traditional recipes passed down through generations.",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    website: "www.mariositalian.com",
    tags: ["Pizza", "Pasta", "Italian", "Family-friendly", "Romantic"],
    features: ["Outdoor Seating", "Takeout", "Delivery", "Vegetarian Options"],
    menu: {
      appetizers: [
        {
          id: 1,
          name: "Bruschetta Classica",
          description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
          price: 8.99,
          image: "/api/placeholder/150/150",
          popular: true
        },
        {
          id: 2,
          name: "Antipasto Platter",
          description: "Selection of cured meats, cheeses, olives, and vegetables",
          price: 16.99,
          image: "/api/placeholder/150/150"
        }
      ],
      pasta: [
        {
          id: 3,
          name: "Spaghetti Carbonara",
          description: "Classic Roman pasta with eggs, cheese, pancetta, and black pepper",
          price: 18.99,
          image: "/api/placeholder/150/150",
          popular: true
        },
        {
          id: 4,
          name: "Fettuccine Alfredo",
          description: "Fresh fettuccine in creamy parmesan sauce",
          price: 16.99,
          image: "/api/placeholder/150/150"
        },
        {
          id: 5,
          name: "Lasagna della Casa",
          description: "Homemade lasagna with meat sauce, ricotta, and mozzarella",
          price: 19.99,
          image: "/api/placeholder/150/150"
        }
      ],
      pizza: [
        {
          id: 6,
          name: "Margherita",
          description: "San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil",
          price: 14.99,
          image: "/api/placeholder/150/150",
          popular: true
        },
        {
          id: 7,
          name: "Pepperoni",
          description: "Tomato sauce, mozzarella, pepperoni",
          price: 16.99,
          image: "/api/placeholder/150/150"
        },
        {
          id: 8,
          name: "Quattro Stagioni",
          description: "Four seasons pizza with artichokes, mushrooms, ham, and olives",
          price: 19.99,
          image: "/api/placeholder/150/150"
        }
      ]
    },
    reviews: [
      {
        id: 1,
        user: {
          name: "Sarah Johnson",
          avatar: "/api/placeholder/40/40"
        },
        rating: 5,
        date: "2024-01-15",
        comment: "Amazing authentic Italian food! The carbonara was perfect and the service was excellent. Highly recommend!",
        helpful: 12
      },
      {
        id: 2,
        user: {
          name: "Mike Chen",
          avatar: "/api/placeholder/40/40"
        },
        rating: 4,
        date: "2024-01-10",
        comment: "Great pizza and cozy atmosphere. The delivery was quick and food arrived hot. Will order again!",
        helpful: 8
      },
      {
        id: 3,
        user: {
          name: "Emily Davis",
          avatar: "/api/placeholder/40/40"
        },
        rating: 5,
        date: "2024-01-08",
        comment: "Best Italian restaurant in the area. Fresh ingredients and generous portions. The tiramisu is to die for!",
        helpful: 15
      }
    ]
  };

  const addToCart = (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const MenuSection = ({ title, items }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 capitalize">{title}</h3>
      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {item.name}
                        {item.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="font-semibold text-lg">${item.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {/* Add dietary info, spice level, etc. */}
                    </div>
                    
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{getItemQuantity(item.id)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Restaurant Info */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-muted-foreground mb-3">{restaurant.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                  </div>
                  <Badge variant={restaurant.openNow ? "default" : "secondary"}>
                    {restaurant.openNow ? "Open Now" : "Closed"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">${restaurant.deliveryFee} delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.cuisine}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="mt-6">
                {Object.entries(restaurant.menu).map(([category, items]) => (
                  <MenuSection key={category} title={category} items={items} />
                ))}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {restaurant.reviews.map(review => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Avatar>
                              <AvatarImage src={review.user.avatar} />
                              <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium">{review.user.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-4 w-4 ${
                                            i < review.rating 
                                              ? 'fill-yellow-400 text-yellow-400' 
                                              : 'text-muted-foreground'
                                          }`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{review.comment}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{review.helpful} people found this helpful</span>
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                  Helpful
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Restaurant Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{restaurant.website}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Opening Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize font-medium">{day}</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.features.map((feature, index) => (
                          <Badge key={index} variant="outline">{feature}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order ({getTotalItems()} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">${item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>${restaurant.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(getTotalPrice() + restaurant.deliveryFee).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/checkout')}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;

