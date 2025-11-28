'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BookingDetails {
  spaceId: string;
  spaceName: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  pricePerHour: number;
  totalAmount: number;
}

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Get booking details from URL params
    const spaceId = searchParams.get('spaceId');
    const spaceName = searchParams.get('spaceName');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const totalHours = searchParams.get('totalHours');
    const pricePerHour = searchParams.get('pricePerHour');

    if (spaceId && spaceName && startDate && endDate && totalHours && pricePerHour) {
      const hours = parseInt(totalHours);
      const price = parseFloat(pricePerHour);
      const total = hours * price;

      setBookingDetails({
        spaceId,
        spaceName,
        startDate,
        endDate,
        totalHours: hours,
        pricePerHour: price,
        totalAmount: total,
      });
    } else {
      // Redirect back if no booking details
      router.push('/spaces');
    }
  }, [searchParams, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create the booking
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: bookingDetails.spaceId,
          startDate: bookingDetails.startDate,
          endDate: bookingDetails.endDate,
        }),
      });

      if (res.ok) {
        // Redirect to success page or dashboard
        router.push('/dashboard?success=true');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingDetails) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Space:</span>
                <span>{bookingDetails.spaceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-in:</span>
                <span>{new Date(bookingDetails.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-out:</span>
                <span>{new Date(bookingDetails.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{bookingDetails.totalHours} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rate:</span>
                <span>${bookingDetails.pricePerHour}/hour</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${bookingDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Credit/Debit Card
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  PayPal
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="card-name" className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    id="card-name"
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="card-expiry" className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      id="card-expiry"
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      id="card-cvv"
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              {processing ? 'Processing Payment...' : `Pay $${bookingDetails.totalAmount.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}