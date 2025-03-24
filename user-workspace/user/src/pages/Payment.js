import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  CreditCardIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Payment = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setPaymentMethods([
        {
          id: 1,
          type: 'credit',
          brand: 'Visa',
          last4: '4242',
          expMonth: '12',
          expYear: '24',
          isDefault: true
        },
        {
          id: 2,
          type: 'credit',
          brand: 'Mastercard',
          last4: '5555',
          expMonth: '08',
          expYear: '25',
          isDefault: false
        }
      ]);
      setDefaultMethod(1);
    } catch (error) {
      addToast('Failed to fetch payment methods', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      setIsAddingCard(true);
      // Initialize Stripe Elements
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const elements = stripe.elements();
      
      const card = elements.create('card');
      card.mount('#card-element');

      card.on('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });

      // Handle form submission
      const form = document.getElementById('payment-form');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { token, error } = await stripe.createToken(card);

        if (error) {
          addToast(error.message, 'error');
        } else {
          // TODO: Send token to server
          addToast('Payment method added successfully', 'success');
          setIsAddingCard(false);
          fetchPaymentMethods();
        }
      });
    } catch (error) {
      addToast('Failed to initialize payment form', 'error');
    }
  };

  const handleRemoveCard = async (paymentMethodId) => {
    try {
      // TODO: Implement API call
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      addToast('Payment method removed successfully', 'success');
    } catch (error) {
      addToast('Failed to remove payment method', 'error');
    }
  };

  const handleSetDefault = async (paymentMethodId) => {
    try {
      // TODO: Implement API call
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      })));
      setDefaultMethod(paymentMethodId);
      addToast('Default payment method updated', 'success');
    } catch (error) {
      addToast('Failed to update default payment method', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Payment Methods List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <CreditCardIcon className="h-6 w-6 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expMonth}/{method.expYear}
                  </p>
                </div>
                {method.isDefault && (
                  <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => handleRemoveCard(method.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Card Button */}
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Add Card Modal */}
      {isAddingCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Payment Method</h3>
              <form id="payment-form">
                <div id="card-element" className="p-4 border rounded-md mb-4"></div>
                <div id="card-errors" className="text-red-600 text-sm mb-4"></div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingCard(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;