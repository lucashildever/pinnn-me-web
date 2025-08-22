"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { apiClient } from "@/lib/api-client/apiClient";
import styles from "./checkout.module.scss";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export enum PaymentPeriod {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

interface CheckoutState {
  clientSecret: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function Checkout() {
  const params = useParams();
  const period = params.period as PaymentPeriod;

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    clientSecret: null,
    isLoading: true,
    error: null,
  });

  const isValidPeriod = Object.values(PaymentPeriod).includes(period);

  const fetchClientSecret = useCallback(async () => {
    if (!isValidPeriod) {
      setCheckoutState({
        clientSecret: null,
        isLoading: false,
        error: "Período de pagamento inválido",
      });
      return;
    }

    try {
      setCheckoutState({
        clientSecret: null,
        isLoading: true,
        error: null,
      });

      const result = await apiClient.stripe.fetchClientSecret("pro", period);

      if (result.success) {
        setCheckoutState({
          clientSecret: result.data.clientSecret,
          isLoading: false,
          error: null,
        });
      } else {
        setCheckoutState({
          clientSecret: null,
          isLoading: false,
          error: result.message,
        });
      }
    } catch (error) {
      setCheckoutState({
        clientSecret: null,
        isLoading: false,
        error: "Erro inesperado ao carregar checkout",
      });
    }
  }, [period, isValidPeriod]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  const options = {
    clientSecret: checkoutState.clientSecret,
    onComplete: () => {
      window.location.href = "/";
    },
  };

  if (!isValidPeriod) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Período Inválido</h2>
          <p>Período de pagamento não reconhecido: {period}</p>
          {/* <a href="/pricing" className={styles.retryButton}> */}
          <a href="/" className={styles.retryButton}>
            Voltar aos Planos
          </a>
        </div>
      </div>
    );
  }

  if (checkoutState.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <h2>Carregando Checkout</h2>
          <p>Preparando sua página de pagamento...</p>
        </div>
      </div>
    );
  }

  if (checkoutState.error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Erro no Checkout</h2>
          <p>{checkoutState.error}</p>
          <button onClick={fetchClientSecret} className={styles.retryButton}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Mostrar informações do período escolhido
  const periodInfo = {
    [PaymentPeriod.MONTHLY]: { name: "Mensal", price: "R$ 29,90/mês" },
    [PaymentPeriod.YEARLY]: { name: "Anual", price: "R$ 299,00/ano" },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Checkout - Plano {periodInfo[period].name}</h1>
        <p>Complete seu pagamento para ativar o plano Pro</p>
        <div className={styles.selectedPlan}>
          <strong>{periodInfo[period].price}</strong>
          {period === PaymentPeriod.YEARLY && (
            <span className={styles.savings}>Economize 2 meses!</span>
          )}
        </div>
      </div>

      <div className={styles.checkoutWrapper}>
        {checkoutState.clientSecret && (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}
