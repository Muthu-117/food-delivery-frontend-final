import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  MapPin, 
  Clock, 
  Truck, 
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Lock
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: ''
    },
    contactInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    deliveryOption: 'standard',
    scheduledTime: '',
    paymentMethod: 'card',
    cardDetails: {
      number: '',
      expiry: '',
      cvv: '',
      name: ''
    },
    promoCode: '',
    saveAddress: false,
    savePayment: false
  });

  const [cart] = useState([
    {
      id: 1,
      name: "Bruschetta Classica",
      price: 8.99,
      quantity: 2,
      restaurant: "Mario's Italian Kitchen"
    },
    {
      id: 3,
      name: "Spaghetti Carbonara",
      price: 18.99,
      quantity: 1,
      restaurant: "Mario's Italian Kitchen"
    }
  ]);

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoApplied, setPromoApplied] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      time: '25-35 min',
      price: 2.99,
      description: 'Regular delivery time'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      time: '15-25 min',
      price: 5.99,
      description: 'Faster delivery for urgent orders'
    },
    {
      id: 'scheduled',
      name: 'Scheduled Delivery',
      time: 'Choose time',
      price: 1.99,
      description: 'Deliver at your preferred time'
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
    { id: 'apple', name: 'Apple Pay', icon: CreditCard },
    { id: 'google', name: 'Google Pay', icon: CreditCard }
  ];

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const handleDirectChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate delivery address
    if (!orderData.deliveryAddress.street.trim()) {
      newErrors['deliveryAddress.street'] = 'Street address is required';
    }
    if (!orderData.deliveryAddress.city.trim()) {
      newErrors['deliveryAddress.city'] = 'City is required';
    }
    if (!orderData.deliveryAddress.state.trim()) {
      newErrors['deliveryAddress.state'] = 'State is required';
    }
    if (!orderData.deliveryAddress.zipCode.trim()) {
      newErrors['deliveryAddress.zipCode'] = 'ZIP code is required';
    }
    
    // Validate contact info
    if (!orderData.contactInfo.name.trim()) {
      newErrors['contactInfo.name'] = 'Name is required';
    }
    if (!orderData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(orderData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Please enter a valid email';
    }
    if (!orderData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone number is required';
    }
    
    // Validate payment details
    if (orderData.paymentMethod === 'card') {
      if (!orderData.cardDetails.number.trim()) {
        newErrors['cardDetails.number'] = 'Card number is required';
      }
      if (!orderData.cardDetails.expiry.trim()) {
        newErrors['cardDetails.expiry'] = 'Expiry date is required';
      }
      if (!orderData.cardDetails.cvv.trim()) {
        newErrors['cardDetails.cvv'] = 'CVV is required';
      }
      if (!orderData.cardDetails.name.trim()) {
        newErrors['cardDetails.name'] = 'Cardholder name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyPromoCode = () => {
    // Mock promo code validation
    const validCodes = {
      'SAVE10': { discount: 10, type: 'percentage' },
      'FIRST5': { discount: 5, type: 'fixed' },
      'FREESHIP': { discount: 2.99, type: 'shipping' }
    };
    
    const code = orderData.promoCode.toUpperCase();
    if (validCodes[code]) {
      setPromoApplied(validCodes[code]);
    } else {
      setErrors(prev => ({ ...prev, promoCode: 'Invalid promo code' }));
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    const selectedOption = deliveryOptions.find(opt => opt.id === orderData.deliveryOption);
    const baseFee = selectedOption ? selectedOption.price : 2.99;
    
    if (promoApplied && promoApplied.type === 'shipping') {
      return Math.max(0, baseFee - promoApplied.discount);
    }
    return baseFee;
  };

  const calculateDiscount = () => {
    if (!promoApplied) return 0;
    
    const subtotal = calculateSubtotal();
    if (promoApplied.type === 'percentage') {
      return (subtotal * promoApplied.discount) / 100;
    } else if (promoApplied.type === 'fixed') {
      return promoApplied.discount;
    }
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = calculateDeliveryFee();
    const discount = calculateDiscount();
    const tax = (subtotal - discount) * 0.08; // 8% tax
    
    return subtotal + deliveryFee - discount + tax;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful order
      const orderId = 'ORD-' + Date.now();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      setErrors({ general: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateCartQuantity = (itemId, change) => {
    // This would normally update the cart state
    console.log(`Update item ${itemId} by ${change}`);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="123 Main Street"
                      value={orderData.deliveryAddress.street}
                      onChange={(e) => handleInputChange('deliveryAddress', 'street', e.target.value)}
                      className={errors['deliveryAddress.street'] ? 'border-destructive' : ''}
                    />
                    {errors['deliveryAddress.street'] && (
                      <p className="text-sm text-destructive mt-1">{errors['deliveryAddress.street']}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={orderData.deliveryAddress.city}
                      onChange={(e) => handleInputChange('deliveryAddress', 'city', e.target.value)}
                      className={errors['deliveryAddress.city'] ? 'border-destructive' : ''}
                    />
                    {errors['deliveryAddress.city'] && (
                      <p className="text-sm text-destructive mt-1">{errors['deliveryAddress.city']}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={orderData.deliveryAddress.state}
                      onValueChange={(value) => handleInputChange('deliveryAddress', 'state', value)}
                    >
                      <SelectTrigger className={errors['deliveryAddress.state'] ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors['deliveryAddress.state'] && (
                      <p className="text-sm text-destructive mt-1">{errors['deliveryAddress.state']}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={orderData.deliveryAddress.zipCode}
                      onChange={(e) => handleInputChange('deliveryAddress', 'zipCode', e.target.value)}
                      className={errors['deliveryAddress.zipCode'] ? 'border-destructive' : ''}
                    />
                    {errors['deliveryAddress.zipCode'] && (
                      <p className="text-sm text-destructive mt-1">{errors['deliveryAddress.zipCode']}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="e.g., Leave at door, Ring doorbell, etc."
                      value={orderData.deliveryAddress.instructions}
                      onChange={(e) => handleInputChange('deliveryAddress', 'instructions', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAddress"
                    checked={orderData.saveAddress}
                    onCheckedChange={(checked) => handleDirectChange('saveAddress', checked)}
                  />
                  <Label htmlFor="saveAddress">Save this address for future orders</Label>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Full Name</Label>
                    <Input
                      id="contactName"
                      placeholder="John Doe"
                      value={orderData.contactInfo.name}
                      onChange={(e) => handleInputChange('contactInfo', 'name', e.target.value)}
                      className={errors['contactInfo.name'] ? 'border-destructive' : ''}
                    />
                    {errors['contactInfo.name'] && (
                      <p className="text-sm text-destructive mt-1">{errors['contactInfo.name']}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      placeholder="+1 (555) 123-4567"
                      value={orderData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                      className={errors['contactInfo.phone'] ? 'border-destructive' : ''}
                    />
                    {errors['contactInfo.phone'] && (
                      <p className="text-sm text-destructive mt-1">{errors['contactInfo.phone']}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={orderData.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                      className={errors['contactInfo.email'] ? 'border-destructive' : ''}
                    />
                    {errors['contactInfo.email'] && (
                      <p className="text-sm text-destructive mt-1">{errors['contactInfo.email']}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={orderData.deliveryOption} 
                  onValueChange={(value) => handleDirectChange('deliveryOption', value)}
                  className="space-y-4"
                >
                  {deliveryOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="flex justify-between items-center cursor-pointer">
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${option.price}</div>
                            <div className="text-sm text-muted-foreground">{option.time}</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                
                {orderData.deliveryOption === 'scheduled' && (
                  <div className="mt-4">
                    <Label htmlFor="scheduledTime">Preferred Delivery Time</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      value={orderData.scheduledTime}
                      onChange={(e) => handleDirectChange('scheduledTime', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={orderData.paymentMethod} 
                  onValueChange={(value) => handleDirectChange('paymentMethod', value)}
                  className="space-y-2"
                >
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                        <method.icon className="h-4 w-4" />
                        {method.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {orderData.paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={orderData.cardDetails.number}
                          onChange={(e) => handleInputChange('cardDetails', 'number', e.target.value)}
                          className={errors['cardDetails.number'] ? 'border-destructive' : ''}
                        />
                        {errors['cardDetails.number'] && (
                          <p className="text-sm text-destructive mt-1">{errors['cardDetails.number']}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={orderData.cardDetails.expiry}
                          onChange={(e) => handleInputChange('cardDetails', 'expiry', e.target.value)}
                          className={errors['cardDetails.expiry'] ? 'border-destructive' : ''}
                        />
                        {errors['cardDetails.expiry'] && (
                          <p className="text-sm text-destructive mt-1">{errors['cardDetails.expiry']}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          value={orderData.cardDetails.cvv}
                          onChange={(e) => handleInputChange('cardDetails', 'cvv', e.target.value)}
                          className={errors['cardDetails.cvv'] ? 'border-destructive' : ''}
                        />
                        {errors['cardDetails.cvv'] && (
                          <p className="text-sm text-destructive mt-1">{errors['cardDetails.cvv']}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={orderData.cardDetails.name}
                          onChange={(e) => handleInputChange('cardDetails', 'name', e.target.value)}
                          className={errors['cardDetails.name'] ? 'border-destructive' : ''}
                        />
                        {errors['cardDetails.name'] && (
                          <p className="text-sm text-destructive mt-1">{errors['cardDetails.name']}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="savePayment"
                        checked={orderData.savePayment}
                        onCheckedChange={(checked) => handleDirectChange('savePayment', checked)}
                      />
                      <Label htmlFor="savePayment">Save this payment method for future orders</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.restaurant}</p>
                        <p className="text-xs text-muted-foreground">${item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Promo Code */}
                <div className="space-y-2">
                  <Label htmlFor="promoCode">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promoCode"
                      placeholder="Enter code"
                      value={orderData.promoCode}
                      onChange={(e) => handleDirectChange('promoCode', e.target.value)}
                      className={errors.promoCode ? 'border-destructive' : ''}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                  {errors.promoCode && (
                    <p className="text-sm text-destructive">{errors.promoCode}</p>
                  )}
                  {promoApplied && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Promo code applied!</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${calculateDeliveryFee().toFixed(2)}</span>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${((calculateSubtotal() - calculateDiscount()) * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Lock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order - ${calculateTotal().toFixed(2)}
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

