import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm } from '../../forms';
import config from "../../config"

import css from './EditListingAvailabilityPanel.css';

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availability,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const seatsDefault = config.seatsDefault;

  const defaultAvailabilityPlan = {
    type: 'availability-plan/day',
    entries: [
      { dayOfWeek: 'mon', seats: seatsDefault },
      { dayOfWeek: 'tue', seats: seatsDefault },
      { dayOfWeek: 'wed', seats: seatsDefault },
      { dayOfWeek: 'thu', seats: seatsDefault },
      { dayOfWeek: 'fri', seats: seatsDefault },
      { dayOfWeek: 'sat', seats: seatsDefault },
      { dayOfWeek: 'sun', seats: seatsDefault },
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const seats = currentListing.attributes.publicData.seats || seatsDefault;

  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
        )}
      </h1>
      <EditListingAvailabilityForm
        className={css.form}
        listingId={currentListing.id}
        initialValues={{ availabilityPlan, seats }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        onSubmit={(values) => {
          // We save the default availability plan
          // I.e. this listing is available every night.
          // Exceptions are handled with live edit through a calendar,
          // which is visible on this panel.
          const {availabilityPlan, seats} = values;
          for(let ele of availabilityPlan.entries) {
            ele.seats = parseInt(seats);
          }

          const updatedData = {
            availabilityPlan,
            publicData: {
              seats,
            }
          }
          onSubmit(updatedData);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  disabled: bool,
  ready: bool,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
