import gql from "graphql-tag";

export const GET_PAYMENT_TOKEN = gql`
  query getPaymentToken($gateway: GatewaysEnum!) {
    paymentClientToken(gateway: $gateway)
  }
`;

export const PAYMENT_METHOD_CREATE = gql`
  mutation createPayment($input: PaymentInput!) {
    checkoutPaymentCreate(input: $input) {
      errors {
        field
        message
      }
    }
  }
`;
