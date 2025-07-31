"use client";

import React, { useState } from 'react';
import { createBaseAccountSDK, pay, getPaymentStatus } from '@base-org/account';
import { SignInWithBaseButton, BasePayButton } from '@base-org/account-ui/react';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize SDK
  const sdk = createBaseAccountSDK({
    appName: 'Base Account Quick-start'
  });

  // Optional sign-in step – not required for `pay()`, but useful to get the user address
  const handleSignIn = async (): Promise<void> => {
    try {
      await sdk.getProvider().request({ method: 'wallet_connect' });
      setIsSignedIn(true);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  // One-tap USDC payment using the pay() function
  const handlePayment = async (): Promise<void> => {
    try {
      // @ts-expect-error this is a bug in the account sdk
      const { id } = await pay({
        amount: '0.01', // USD – SDK quotes equivalent USDC
        to: '0x0000000000000000000000000000000000000001', // Replace with your recipient address
        testnet: true // set to false or omit for Mainnet
      });
      console.log(id)

      setPaymentId(id);
      setPaymentStatus('Payment initiated! Click "Check Status" to see the result.');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('Payment failed');
    }
  };

  // Check payment status using stored payment ID
  const handleCheckStatus = async (): Promise<void> => {
    if (!paymentId) {
      setPaymentStatus('No payment ID found. Please make a payment first.');
      return;
    }

    try {
      const { status } = await getPaymentStatus({ id: paymentId, testnet: true });
      setPaymentStatus(`Payment status: ${status}`);
    } catch (error) {
      console.error('Status check failed:', error);
      setPaymentStatus('Status check failed');
    }
  };

  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const dark = theme === 'dark';
  const styles = {
    container: { 
      minHeight: '100vh', 
      backgroundColor: dark ? '#111' : '#fff', 
      color: dark ? '#fff' : '#000', 
      display: 'flex', 
      flexDirection: 'column' as const, 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px' 
    },
    card: { 
      backgroundColor: dark ? '#222' : '#f9f9f9', 
      borderRadius: '12px', 
      padding: '30px', 
      maxWidth: '400px', 
      textAlign: 'center' as const 
    },
    title: { 
      fontSize: '24px', 
      fontWeight: 'bold', 
      marginBottom: '10px', 
      color: dark ? '#fff' : '#00f' 
    },
    subtitle: { 
      fontSize: '16px', 
      color: dark ? '#aaa' : '#666', 
      marginBottom: '30px' 
    },
    themeToggle: { 
      position: 'absolute' as const, 
      top: '20px', 
      right: '20px', 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer', 
      fontSize: '18px' 
    },
    buttonGroup: { 
      display: 'flex', 
      flexDirection: 'column' as const, 
      gap: '16px', 
      alignItems: 'center' 
    },
    status: { 
      marginTop: '20px', 
      padding: '12px', 
      backgroundColor: dark ? '#333' : '#f0f0f0', 
      borderRadius: '8px', 
      fontSize: '14px' 
    },
    signInStatus: { 
      marginTop: '8px', 
      fontSize: '14px', 
      color: dark ? '#0f0' : '#060' 
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
      <div style={styles.card}>
        <h1 style={styles.title}>Base Account</h1>
        <p style={styles.subtitle}>Experience seamless crypto payments</p>
        
        <div style={styles.buttonGroup}>
          <SignInWithBaseButton 
            align="center"
            variant="solid"
            colorScheme={theme}
            size="medium"
            onClick={handleSignIn}
          />
          
          {isSignedIn && (
            <div style={styles.signInStatus}>
              ✅ Connected to Base Account
            </div>
          )}
          
          <BasePayButton 
            colorScheme={theme}
            onClick={handlePayment}
          />
          
          {paymentId && (
            <button 
              onClick={handleCheckStatus}
              style={{
                padding: '12px 24px',
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                color: theme === 'dark' ? '#ffffff' : '#1f2937',
                border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Check Payment Status
            </button>
          )}
        </div>

        {paymentStatus && (
          <div style={styles.status}>
            {paymentStatus}
          </div>
        )}
      </div>
    </div>
  );
}
