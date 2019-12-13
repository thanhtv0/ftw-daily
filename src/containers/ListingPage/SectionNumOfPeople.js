import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './ListingPage.css';

const SectionNumOfPeople = props => {
  const { publicData } = props;

  if(!publicData) {
    return null;
  }

  const numOfPeople = publicData && publicData.numberOfPeople ? publicData.numberOfPeople : null;

  return numOfPeople ? (
    <div className={css.sectionCapacity}>
      <h2 className={css.capacityTitle}>
        <FormattedMessage id="ListingPage.numOfPeopleTitle" />
      </h2>
      <p className={css.capacity}>{numOfPeople}</p>
    </div>
  ) : null;
};


export default SectionNumOfPeople;