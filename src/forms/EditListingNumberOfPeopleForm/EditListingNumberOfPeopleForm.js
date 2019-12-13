import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button } from '../../components';
import { required } from '../../util/validators';

import css from './EditListingNumberOfPeopleForm.css';
import { intlShape } from '../../util/reactIntl';

export const EditListingNumberOfPeopleFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
      } = fieldRenderProps;

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingNumberOfPeopleForm.updateFailed" />
        </p>
      ) : null;

      const numberOfPeopleRequired = required(
        intl.formatMessage({
          id: 'EditListingNumberOfPeopleForm.numberOfPeopleRequired',
        })
      );

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}

          <Field 
            className={css.numOfPeople}
            name={"numberOfPeople"}
            id={"numberOfPeople"}
            validate={numberOfPeopleRequired}
            component="input"
            placeholder={1}
            type="number"
            min={1}
          />

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

EditListingNumberOfPeopleFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
};

EditListingNumberOfPeopleFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  name: string.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  numberOfPeople: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
};

export default compose(injectIntl)(EditListingNumberOfPeopleFormComponent);