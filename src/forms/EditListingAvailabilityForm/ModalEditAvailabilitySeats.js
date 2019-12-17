import React from "react";
import moment from "moment";
import css from "./ManageAvailabilityCalendar.css";
import { FormattedMessage } from "../../util/reactIntl"

const ModalEditAvailabilitySeats = (props) => {

    const {
        date,
        isOpen,
        onClose,
        onSave,
        onChange,
        seatsInit,
        value,
        numOfBooking,
    } = props;

    if(!isOpen) {
        return null;
    }

    const availabilitySeats = parseInt(seatsInit) - numOfBooking;
    const message = value === "" ? <FormattedMessage id="ManageAvailabilityCalendar.seatsIsNotEmpty"/>
                    : parseInt(value) > availabilitySeats ? <FormattedMessage id="ManageAvailabilityCalendar.seatsIsNotMoreThan" values={{ value: availabilitySeats }} />
                    : parseInt(value) < 0 ? <FormattedMessage id="ManageAvailabilityCalendar.seatsIsNotLessThanZero" />
                    : null;

    return (
        <div className={css.modal}>
            <div className={css.modalContent}>
                <label>Set availability seats for {moment(date).format("DD/MM/YYYY")}</label>
                <input onChange={(e) => onChange(e.target.value)} type="number" min={0} max={availabilitySeats} value={value} placeholder="0"/>
                <span className={css.warning}>{message}</span>
                <div className={css.buttonWrapper}>
                    <button onClick={onSave} type="button">Save</button>
                    <button onClick={onClose} className={css.btnCancel} type="button"> Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ModalEditAvailabilitySeats;