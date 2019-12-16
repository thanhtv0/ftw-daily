import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button } from '../../components';

import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import css from './EditListingAvailabilityForm.css';

export class EditListingAvailabilityFormComponent extends Component {
  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const {
            className,
            rootClassName,
            disabled,
            ready,
            handleSubmit,
            //intl,
            invalid,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            availability,
            availabilityPlan,
            listingId,
            initialValues,
          } = formRenderProps;

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitReady = (updated && pristine) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled = invalid || disabled || submitInProgress;
          const { seats } = initialValues;

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}
              <div className={css.calendarWrapper}>
                <ManageAvailabilityCalendar
                  availability={availability}
                  availabilityPlan={availabilityPlan}
                  listingId={listingId}
                  seatsInit={seats}
                />
              </div>

              <div className={css.seatsWrapper}>
                <label>Seats</label>
                <Field
                  id='seats'
                  name="seats"
                  component="input"
                  type="number"
                  placeholder="1"
                  min={1}
                />
              </div>

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
};

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool,
  ready: bool,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
};

export default compose(injectIntl)(EditListingAvailabilityFormComponent);
