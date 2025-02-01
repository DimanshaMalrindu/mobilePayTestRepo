import React, { useState, useEffect } from 'react';
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import {
  useStripe,
  PaymentElement,
  Elements
} from "@stripe/react-stripe-js";
import axios from 'axios';
import CardComponent from './Card.tsx';

const baseURL = 'https://plugkaro-csms.fly.dev/api/v1/';

const stripePromise = loadStripe('pk_live_51MtxkaKRzm9Te7g8i3ZS9J58V2JTXukI2AgfzyZPvDyLXFAxozfWSASuoIgBV1ev3FnzOTVFsrKSLAqa7SeRj5mc00n8PwfWaM');
// const stripePromise = loadStripe('pk_test_51MtxkaKRzm9Te7g8OTUxqutdzDY9XqQMydztUG1XXtGqzo2olj16lx2NkRwXQjsOxvdbnLKMio1yRBYGQjQ61Zqw00xaJPcjkH');
function App() {
  const [clientSecret, setClientSecret] = useState(null);
  const getApi = async () => {
    const apiKey = process.env.API_KEY;

    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'key1',
        },
    });

    return api;
};
  const fetchClientSecret = async () => {
    const api = await getApi();
    const response = await api.post('/payment/create_payment_intent', {
        "amount": 1600
      })
    return response.data;
  }

  const getPaymentIntent = async () => {
    const response = await fetchClientSecret();
    setClientSecret(response.client_secret);
    console.log("client secret --- ", response.client_secret);
  }
  useEffect(() => {
      getPaymentIntent();
  }, [])

  return (
    <div className="App">
      {clientSecret && 
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CardComponent stripePromise={stripePromise}
                                        />
        </Elements>
                                      }
    </div>
  );
}

export default App;
