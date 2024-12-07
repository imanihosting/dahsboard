import React, { createContext, useContext } from 'react';

const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  // For demonstration purposes, we'll just provide basic functionality
  const createCheckoutSession = async (priceId) => {
    try {
      // In a real application, this would make an API call to your backend
      // to create a Stripe checkout session
      console.log('Creating checkout session for price:', priceId);
      return {
        url: '#' // Mock URL for demonstration
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };

  const value = {
    createCheckoutSession
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};
