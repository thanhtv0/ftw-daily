import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureListing } from '../../util/data';
import { EditListingAnimalsForm } from '../../forms';
import { ListingLink } from '../../components';

import css from './EditListingAnimalsPanel.css';

const ANIMALS_NAME = 'animals';

const EditListingAnimalsPanel = props => {
  const {
    rootClassName,
    className,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingAnimalsPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingAnimalsPanel.createListingTitle" />
  );

  const animals = publicData && publicData.animals;
  const initialValues = { animals };

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingAnimalsForm
        className={css.form}
        name={ANIMALS_NAME}
        initialValues={initialValues}
        onSubmit={values => {
          const { animals = [] } = values;

          const updatedValues = {
            publicData: { animals },
          };
          onSubmit(updatedValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
      />
    </div>
  );
};

EditListingAnimalsPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string } = PropTypes;

EditListingAnimalsPanel.propTypes = {
  rootClassName: string,
  className: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAnimalsPanel;
