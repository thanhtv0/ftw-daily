import React from 'react';
import { intlShape, FormattedMessage } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_SALE_OF_ON_MONDAY, propTypes } from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader';
import css from './BookingBreakdown.css';

const { Money } = sdkTypes;

const isValidCommission = commissionLineItem => {
    return (
        commissionLineItem &&
        commissionLineItem.lineTotal instanceof Money
    );
};

const LineItemSaleOf = props => {
    const { transaction, intl } = props;

    let SaleOfComponet = null;

    const lineItemSaleOf = transaction.attributes.lineItems.find(
        item => item.code === LINE_ITEM_SALE_OF_ON_MONDAY && !item.reversal
    );

    const payoutTotal = transaction ? transaction.attributes.payoutTotal : null;

    if (lineItemSaleOf && payoutTotal) {
        if (!isValidCommission(lineItemSaleOf)) {
            // eslint-disable-next-line no-console
            console.error('invalid commission line item:', lineItemSaleOf);
            throw new Error('Commission should be present and the value should be zero or positive');
        }
        
        const saleOfPrice = lineItemSaleOf.lineTotal;
        const formatSaleOfPrice = saleOfPrice ? formatMoney(intl, saleOfPrice) : null;
        const formatTotalPriceAfterSale = payoutTotal ? formatMoney(intl, payoutTotal) : null;

        SaleOfComponet = (
            <>
                <div className={css.lineItem}>
                    <span className={css.itemLabel}>
                        <FormattedMessage id="LineItemSaleOf.saleOffTitle"/>
                </span>
                    <span className={css.itemValue}>{formatSaleOfPrice}</span>
                </div>
                <hr className={css.totalDivider} />
                <div className={css.lineItem}>
                    <span className={css.itemLabel}>
                        <FormattedMessage id="LineItemSaleOf.totalPriceAfterSale"/>
                </span>
                    <span className={css.itemValue}>{formatTotalPriceAfterSale}</span>
                </div>
            </>
        );
    }

    return SaleOfComponet;
};

LineItemSaleOf.propTypes = {
    transaction: propTypes.transaction.isRequired,
    intl: intlShape.isRequired,
};

export default LineItemSaleOf;