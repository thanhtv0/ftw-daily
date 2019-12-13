/**
 * Booking breakdown estimation
 *
 * Transactions have payment information that can be shown with the
 * BookingBreakdown component. However, when selecting booking
 * details, there is no transaction object present and we have to
 * estimate the breakdown of the transaction without data from the
 * API.
 *
 * If the payment process of a customized marketplace is something
 * else than simply daily or nightly bookings, the estimation will
 * most likely need some changes.
 *
 * To customize the estimation, first change the BookingDatesForm to
 * collect all booking information from the user (in addition to the
 * default date pickers), and provide that data to the
 * EstimatedBreakdownMaybe components. You can then make customization
 * within this file to create a fake transaction object that
 * calculates the breakdown information correctly according to the
 * process.
 *
 * In the future, the optimal scenario would be to use the same
 * transactions.initiateSpeculative API endpoint as the CheckoutPage
 * is using to get the breakdown information from the API, but
 * currently the API doesn't support that for logged out users, and we
 * are forced to estimate the information here.
 */
import React from 'react';
import moment from 'moment';
import Decimal from 'decimal.js';
import { types as sdkTypes } from '../../util/sdkLoader';
import { dateFromLocalToAPI, nightsBetween, daysBetween } from '../../util/dates';
import { TRANSITION_REQUEST_PAYMENT, TX_TRANSITION_ACTOR_CUSTOMER } from '../../util/transaction';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, LINE_ITEM_UNITS, DATE_TYPE_DATE, LINE_ITEM_CUSTOMER_COMMISSION, LINE_ITEM_SALE_OF_ON_MONDAY } from '../../util/types';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit } from '../../util/currency';
import { BookingBreakdown } from '../../components';
import config from "../../config"

import css from './BookingDatesForm.css';

const { Money, UUID } = sdkTypes;

//Check has monday in booking
const hasMonday = (bookingStart, bookingEnd) => {
  let start = moment(bookingStart);
  let end = moment(bookingEnd).valueOf();
  while(start.valueOf() <= end ) {
    if(start.get("day") === 1) {
      return true;
    } //is monday
    start.add(1, "days");
  }

  return false;
}

const estimatedTotalPrice = (unitPrice, unitCount, isSale) => {
  const numericPrice = convertMoneyToNumber(unitPrice);
  const numericTotalPrice = new Decimal(numericPrice).times(unitCount).toNumber();
  let numericTotalPriceAfterSale = numericTotalPrice;
  let customerCommission = 0;

  if(isSale) {
    numericTotalPriceAfterSale = numericTotalPrice <= config.saleOfPrice ? 1 : numericTotalPrice - config.saleOfPrice;
  }

  let saleOff = 0

  if(numericTotalPrice !== 1) {
    if(numericTotalPrice <= config.saleOfPrice)
      saleOff = numericTotalPrice - 1;
    else
      saleOff = config.saleOfPrice;
  }

  saleOff = new Decimal(saleOff).times(-1).toNumber();

  const totalPrice = new Money(
    convertUnitToSubUnit(numericTotalPrice, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  );

  const totalPayout = new Money(
    convertUnitToSubUnit(numericTotalPriceAfterSale, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  );

  // estimated price with commission
  if(numericTotalPriceAfterSale <= 100 ) {
    customerCommission = new Decimal(numericTotalPriceAfterSale).times(0.1).toNumber();
    numericTotalPriceAfterSale = new Decimal(numericTotalPriceAfterSale).times(1.1).toNumber();
  }
  else if(numericTotalPriceAfterSale >= 200) {
    customerCommission = new Decimal(numericTotalPriceAfterSale).times(0.2).toNumber();
    numericTotalPriceAfterSale = new Decimal(numericTotalPriceAfterSale).times(1.2).toNumber();
  }
  else {
    customerCommission = new Decimal(numericTotalPriceAfterSale).times(0.15).toNumber();
    numericTotalPriceAfterSale = new Decimal(numericTotalPriceAfterSale).times(1.15).toNumber();
  }

  const totalPayin = new Money(
    convertUnitToSubUnit(numericTotalPriceAfterSale, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  );

  const totalCustomerCommission = new Money(
    convertUnitToSubUnit(customerCommission, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  );

  const saleOffPrice = new Money(
    convertUnitToSubUnit(saleOff, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  )

  return {totalPrice, totalPayin, totalPayout, totalCustomerCommission, saleOffPrice};
};

// When we cannot speculatively initiate a transaction (i.e. logged
// out), we must estimate the booking breakdown. This function creates
// an estimated transaction object for that use case.
const estimatedTransaction = (unitType, bookingStart, bookingEnd, unitPrice, quantity, _startTime, _endTime, saleOfOnMonday) => {
  const now = new Date();
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;

  const _unitCount = isNightly
    ? nightsBetween(bookingStart, bookingEnd)
    : isDaily
    ? daysBetween(bookingStart, bookingEnd)
    : quantity;

  const unitCount = _unitCount === 0 ? 1 : _unitCount;

  const isSale = saleOfOnMonday && hasMonday(bookingStart, bookingEnd);

  const { totalPrice, totalPayin, totalPayout, totalCustomerCommission, saleOffPrice } = estimatedTotalPrice(unitPrice, unitCount, isSale);
  // bookingStart: "Fri Mar 30 2018 12:00:00 GMT-1100 (SST)" aka "Fri Mar 30 2018 23:00:00 GMT+0000 (UTC)"
  // Server normalizes night/day bookings to start from 00:00 UTC aka "Thu Mar 29 2018 13:00:00 GMT-1100 (SST)"
  // The result is: local timestamp.subtract(12h).add(timezoneoffset) (in eg. -23 h)

  // local noon -> startOf('day') => 00:00 local => remove timezoneoffset => 00:00 API (UTC)
  const serverDayStart = dateFromLocalToAPI(
    moment(bookingStart)
      .startOf('day')
      .toDate()
  );
  const serverDayEnd = dateFromLocalToAPI(
    moment(bookingEnd)
      .startOf('day')
      .toDate()
  );

  const itemSalePrice = saleOffPrice;

  const lineItemSaleOf = {
    code: LINE_ITEM_SALE_OF_ON_MONDAY,
    reversal: false,
    unitPrice: itemSalePrice,
    includeFor: ["customer" , "provider"],
    lineTotal: itemSalePrice,
  };

  const lineItemSaleOfMaybe = isSale ? [lineItemSaleOf] : [];

  return {
    id: new UUID('estimated-transaction'),
    type: 'transaction',
    attributes: {
      createdAt: now,
      lastTransitionedAt: now,
      lastTransition: TRANSITION_REQUEST_PAYMENT,
      payinTotal: totalPayin,
      payoutTotal: totalPayout,
      lineItems: [
        {
          code: unitType,
          includeFor: ['customer', 'provider'],
          unitPrice: unitPrice,
          quantity: new Decimal(unitCount),
          lineTotal: totalPrice,
          reversal: false,
        },
        {
          code: LINE_ITEM_CUSTOMER_COMMISSION,
          includeFor: ["customer"],
          reversal: false,
          unitPrice: totalCustomerCommission,
          lineTotal: totalCustomerCommission,
        },
        ...lineItemSaleOfMaybe,
      ],
      transitions: [
        {
          createdAt: now,
          by: TX_TRANSITION_ACTOR_CUSTOMER,
          transition: TRANSITION_REQUEST_PAYMENT,
        },
      ],
    },
    booking: {
      id: new UUID('estimated-booking'),
      type: 'booking',
      attributes: {
        start: serverDayStart,
        end: serverDayEnd,
        startTime: _startTime,
        endTime: _endTime,
      },
    },
  };
};

const EstimatedBreakdownMaybe = props => {
  const { unitType, unitPrice, startDate, endDate, quantity, startTime, endTime, saleOfOnMonday } = props.bookingData;
  const isUnits = unitType === LINE_ITEM_UNITS;
  const quantityIfUsingUnits = !isUnits || Number.isInteger(quantity);
  const canEstimatePrice = startDate && endDate && unitPrice && quantityIfUsingUnits;
  if (!canEstimatePrice) {
    return null;
  }

  const tx = estimatedTransaction(unitType, startDate, endDate, unitPrice, quantity, startTime, endTime, saleOfOnMonday);

  return (
    <BookingBreakdown
      className={css.receipt}
      userRole="customer"
      unitType={unitType}
      transaction={tx}
      booking={tx.booking}
      dateType={DATE_TYPE_DATE}
      startTime={startTime}
      endTime={endTime}
    />
  );
};

export default EstimatedBreakdownMaybe;
