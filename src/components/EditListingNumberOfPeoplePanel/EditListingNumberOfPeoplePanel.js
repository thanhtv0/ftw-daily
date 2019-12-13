import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '..';
import { EditListingNumberOfPeopleForm } from '../../forms';
import config from '../../config.js';

import css from './EditListingNumberOfPeoplePanel.css';

const ANIMALS_NAME = 'animals';

const EditListingNumberOfPeoplePanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { publicData } = currentListing.attributes;

  const panelTitle = currentListing.id ? (
    <FormattedMessage
      id="EditListingPeoplesPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingPeoplesPanel.createListingTitle" />
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingNumberOfPeopleForm
        className={css.form}
        name={ANIMALS_NAME}
        initialValues={{ numberOfPeople: publicData.numberOfPeople}}
        onSubmit={values => {
          const { numberOfPeople } = values;
          const updateValues = {
            publicData: {
              "numberOfPeople": parseInt(numberOfPeople),
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
        numberOfPeople={config.custom.numberOfPeople}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingNumberOfPeoplePanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingNumberOfPeoplePanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingNumberOfPeoplePanel;