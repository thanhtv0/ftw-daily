import React from 'react';
import Decimal from 'decimal.js';
import {
  LINE_ITEM_NIGHT,
  LINE_ITEM_SALE_OF_ON_MONDAY
} from '../../util/types';
import { nightsBetween, daysBetween } from '../../util/dates';
import { convertMoneyToNumber } from '../../util/currency';
import config from '../../config';

import css from './TransactionPanel.css';

const InvalidPriceMessageMaybe = props => {
  const { transaction, listing, transactionRole, intl } = props;
  const loaded =
    transaction &&
    transaction.id &&
    transaction.booking &&
    transaction.booking.id;
  if (!loaded) {
    return null;
  }

  const unitType = config.bookingUnitType;

  const isProvider = transactionRole === 'provider';
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const { start, end } = transaction.booking.attributes;

  const quantityBetweenDay = isNightly
    ? nightsBetween(start, end)
    : daysBetween(start, end);
  const quantity = quantityBetweenDay === 0 ? 1 : quantityBetweenDay;

  // expected booking total
  const listingUnitPrice = listing.attributes.price;
  const listingNumericUnitPrice = convertMoneyToNumber(
    listingUnitPrice
  );

  const listingUnitTotal = new Decimal(listingNumericUnitPrice)
    .times(quantity)
    .toNumber();

    //Caculate price after sale
    const saleOfLineItem = transaction.attributes.lineItems.find(
        item => item.code === LINE_ITEM_SALE_OF_ON_MONDAY && !item.reversal
    );

    const saleOfTotal = saleOfLineItem ? convertMoneyToNumber(saleOfLineItem.lineTotal) : 0;

  const payoutTotal = convertMoneyToNumber(
    transaction.attributes.payoutTotal
  );

  const expectedPayoutTotal = new Decimal(listingUnitTotal)
    .plus(saleOfTotal)
    .toNumber();

  const priceInvalid = expectedPayoutTotal !== payoutTotal;

  const message = intl.formatMessage({
    id: 'BookingBreakdown.invalidPrice',
  });

  const showMessage = isProvider && priceInvalid;

  return showMessage ? (
    <p className={css.invalidPriceMessage}>{message}</p>
  ) : null;
};

export default InvalidPriceMessageMaybe;