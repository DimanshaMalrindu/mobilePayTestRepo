import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {
    useStripe,
    useElements,
    CardElement,
    PaymentRequestButtonElement,
    PaymentElement,
    Elements
  } from "@stripe/react-stripe-js";

const baseURL = 'https://plugkaro-csms.fly.dev/api/v1/';


const CardComponent = (props: any) => {
    const stripe = useStripe();
    const [paymentRequest, setPaymentRequest] = useState<any>();
    const [payButtonClicked, setPayButtonClicked] = useState<boolean>(false);
    const elements = useElements();

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
    const authorizePayment = async (chargerID: string, connectorID: string, requestBody: any) => {
        console.log("authorize payment")
        const api_Auth = await getApi();
    const resp = await api_Auth.post(`payment/authorize_payment?charge_point_id=${chargerID}&connector_id=${connectorID}`, requestBody);

    return resp.data;
    };

    // useEffect(() => {
    //     if (stripe) {
    //       foo();
    //     }
    //   }, [stripe]);
    
    //   const foo = () => {
    //     if (!stripe) {
    //       return;
    //     }
    //     const pr = stripe.paymentRequest({
    //       country: "FI",
    //       currency: "eur",
    //       total: {
    //         label: "Total",
    //         amount: 1600, // The amount in cents
    //       },
    //       // requestPayerName: true,
    //       // requestPayerEmail: true,
    
    //     });
    
    //     pr.canMakePayment().then((result) => {
    //       if (result) {
    //         setPaymentRequest(pr);
    //       }
    //     });
    
    //     pr.on("paymentmethod", async (ev) => {
    //       try {
    //         const sessionId = localStorage.getItem("sessionId");
    //         const paymentMethodId = ev.paymentMethod.id;
    //         const requestBody = {
    //           amount: props.selectedAmount,
    //           payment_method: paymentMethodId
    //         }
    //         const responseData = await authorizePayment(
    //           props.chargerID,
    //           props.connectorID,
    //           requestBody
    //         ).then((res) => {
    //           localStorage.setItem("transactionId", res.transaction_id);
    //           props.setTransactionId(res.transaction_id)
    //           if (res.transaction_id) {
    //             ev.complete("success");
    //             props.setLoading(false);
    //             // navigate('/ChargingSessionScreen')
    //             props.setOtp(res.otp)
    //             // navigate('/OtpScreen')
    //           }
    //         });
    //         // navigate('/ChargingSessionScreen')
    //       } catch (error) {
    //         console.error("Payment authorization failed 2:", error);
    //         setPayButtonClicked(false)
    //       }
    //     });
    //     // if(!paymentRequest){
    //     //   setPaymentOption('card');
    //     // }
      
    //   }
    
      const handleSubmit = async (event: any) => {
        // foo();
        props.setLoading(true);
        setPayButtonClicked(true)
        setTimeout(() => { }, 2000);
        event.preventDefault();
    
        if (!stripe || !elements) {
          return;
        }
    
        const cardElement = elements.getElement(CardElement);
    
        if (!cardElement) {
          return;
        }
    
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
    
        if (error) {
          console.error(error);
        } else {
          try {
            let sessionId = localStorage.getItem("sessionId");
            let paymentMethodId = paymentMethod.id;
    
            const requestBody = {
              amount: props.selectedAmount,
              payment_method: paymentMethodId
            }
            const responseData = await authorizePayment(
              props.chargerID,
              props.connectorID,
              requestBody
            ).then((res: any) => {
              localStorage.setItem("transactionId", res.transaction_id);
              props.setTransactionId(res.transaction_id)
              if (res.transaction_id) {
                props.setLoading(false);
                props.setOtp(res.otp)
                localStorage.setItem('otp', res.otp); // write otp in browser cache.
                console.log("otp")
    
                 //navigate('/OtpScreen') // Dont navigate to the otp screen, write the otp in browser cache, then read it from the cache, clear the browser cache after six hours.
                 
              }
    
            })
          } catch (error) {
            console.error("Payment authorization failed 1:", error);
            setPayButtonClicked(false);
          }
        }
    
      };

return(
    <div>card
      <PaymentElement className={payButtonClicked ? 'card-element' : 'card-element'}  options={{layout: 'accordion'}} />
    </div>
)

}

export default CardComponent