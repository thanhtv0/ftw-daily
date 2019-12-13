import React, { useState, useEffect } from "react"
// import classNames from "classnames"
import { Field } from 'react-final-form'
import css from "./FieldTimeRangeInput.css"
import moment from "moment"
import config from "../../config"

const FieldTimeRangeInput = props => {
    const {
        name,
        startTime,
        endTime,
        startDate,
        endDate,
        form
    } = props;

    const [startTimeArr, setStartTimeArr] = useState([]);
    const [endTimeArr, setEndTimeArr] = useState([]);
    const timeRange = config && config.timeRange ? config.timeRange : 30;
    const formatTime = "HH:mm";

    useEffect(() => {
        if (startDate && endDate) {
            form.change(`${name}.startTime`, null);
            form.change(`${name}.endTime`, null);
            updateTimeArr(null, startDate, endDate);
        }
    }, [startDate, endDate])

    useEffect(() => {
        if (startTime) {
            let startDateParam = moment(startDate);
            let endDateParam = moment(endDate);
            if (startDateParam.format("DD/MM/YYYY") === endDateParam.format("DD/MM/YYYY")) {
                updateTimeArr(startTime, startDate, endDate);
                if (endTime && parseInt(startTime.substring(0, 2)) > parseInt(endTime.substring(0, 2))) {
                    let newTime = moment(startTime, formatTime).add(timeRange, "minutes");
                    form.change(`${name}.endTime`, newTime.format(formatTime));
                }
            }
        }
    }, [startTime])

    const updateTimeArr = (startTimeParam, startDateParam, endDateParam) => {
        let startTimeArr = [];
        let endTimeArr = [];
        let startDate = moment(startDateParam);
        let endDate = moment(endDateParam);

        let startTime;
        if (startDate.format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")) {
            startTime = moment().add(1, "hours");
        }
        else {
            startTime = startDate.clone().set('hour', 0);
        }
        startTime.set("minute", 0);

        let endTime;

        if (endDate.format("DD/MM/YYYY") === startDate.format("DD/MM/YYYY")) {
            if (startTimeParam) {
                endTime = startDate.clone().set("hour", parseInt(startTimeParam.substring(0, 2))).set("minute", parseInt(startTimeParam.substring(3, 5))).add(timeRange, "minutes");
            }
            else {
                endTime = startTime.clone().add(timeRange, "minutes");
            }
        }
        else {
            endTime = endDate.clone().set('hour', 0);
        }

        startDate.set("hour", 23).set("minute", 59);
        while (startTime.valueOf() <= startDate.valueOf()) {
            startTimeArr.push(startTime.format(formatTime));
            startTime.add(timeRange, "minutes");
        }

        endDate.set("hour", 23).set("minute", 59);
        while (endTime.valueOf() <= endDate.valueOf()) {
            endTimeArr.push(endTime.format(formatTime));
            endTime.add(timeRange, "minutes");
        }

        if (endDate.format("DD/MM/YYYY") === startDate.format("DD/MM/YYYY")) {
            startTimeArr.pop();
        }

        setStartTimeArr(startTimeArr);
        setEndTimeArr(endTimeArr);
    }

    return (
        <>
            {(startDate && endDate) ?
                <div className={css.root}>
                    <div className={css.startTime}>
                        <label>Start time</label>
                        <Field
                            name={`${name}.startTime`}
                            component="select"
                        >
                            <option value="" disabled>00:00</option>
                            {startTimeArr.map((value, index) => <option key={index} value={value}>{value}</option>)}
                        </Field>
                    </div>
                    <div className={css.endTime}>
                        <label>End time</label>
                        <Field
                            name={`${name}.endTime`}
                            component="select"
                        >
                            <option value="" disabled>00:00</option>
                            {endTimeArr.map((value, index) => <option key={index} value={value}>{value}</option>)}
                        </Field>
                    </div>
                </div> : null}
        </>
    )
}

export default FieldTimeRangeInput;