import * as React from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router";

import { ShippingAddressForm } from "..";
import { CheckoutContext } from "../CheckoutApp/context";
import { checkoutShippingOptionsUrl } from "../CheckoutApp/routes";
import { ShopContext } from "../ShopProvider/context";
import { UPDATE_CHECKOUT_SHIPPING_ADDRESS } from "./queries";

class CheckoutShipping extends React.Component<
  RouteComponentProps<{ id }>,
  { resetPassword: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { resetPassword: false };
  }

  render() {
    return (
      <div className="checkout-shipping">
        <CheckoutContext.Consumer>
          {({ checkout, updateCheckout }) => (
            <>
              <div className="checkout__step">
                <span>1</span>
                <h4 className="checkout__header">Shipping Address</h4>
              </div>

              <Mutation mutation={UPDATE_CHECKOUT_SHIPPING_ADDRESS}>
                {(saveShippingAddress, { data, loading }) => {
                  if (
                    data &&
                    data.checkoutShippingAddressUpdate.errors.length === 0 &&
                    data.checkoutEmailUpdate.errors.length === 0
                  ) {
                    updateCheckout({
                      checkout: data.checkoutEmailUpdate.checkout
                    });
                    this.props.history.push(
                      checkoutShippingOptionsUrl(checkout.token)
                    );
                  }
                  return (
                    <div className="checkout__content">
                      <ShopContext.Consumer>
                        {({ defaultCountry, geolocalization }) => (
                          <ShippingAddressForm
                            data={
                              checkout.shippingAddress &&
                              checkout.shippingAddress.country
                                ? {
                                    ...checkout.shippingAddress,
                                    email: checkout.email
                                  }
                                : {
                                    ...checkout.shippingAddress,
                                    country: {
                                      code: geolocalization.country
                                        ? geolocalization.country.code
                                        : defaultCountry.code,
                                      country: geolocalization.country
                                        ? geolocalization.country.country
                                        : defaultCountry.country
                                    },
                                    email: checkout.email
                                  }
                            }
                            buttonText="Continue to Shipping"
                            errors={
                              data && data.checkoutShippingAddressUpdate.errors
                            }
                            loading={loading}
                            onSubmit={(event, data) => {
                              saveShippingAddress({
                                variables: {
                                  checkoutId: checkout.id,
                                  email: data.email,
                                  shippingAddress: {
                                    city: data.city,
                                    companyName: data.companyName,
                                    country:
                                      data.country.value || data.country.code,
                                    countryArea: data.countryArea,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    phone: data.phone,
                                    postalCode: data.postalCode,
                                    streetAddress1: data.streetAddress1,
                                    streetAddress2: data.streetAddress2
                                  }
                                }
                              });
                              updateCheckout({
                                shippingAsBilling: data.asBilling
                              });
                              event.preventDefault();
                            }}
                          />
                        )}
                      </ShopContext.Consumer>
                    </div>
                  );
                }}
              </Mutation>
              <div className="checkout__step">
                <span>2</span>
                <h4 className="checkout__header">Shipping Method</h4>
              </div>
              <div className="checkout__step">
                <span>3</span>
                <h4 className="checkout__header">Billing</h4>
              </div>
              <div className="checkout__step">
                <span>4</span>
                <h4 className="checkout__header">Payment Method</h4>
              </div>
            </>
          )}
        </CheckoutContext.Consumer>
      </div>
    );
  }
}

export default CheckoutShipping;
