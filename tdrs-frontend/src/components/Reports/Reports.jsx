import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import Button from '../Button'
import { setYear, setStt, setQuarter } from '../../actions/reports'
import UploadReport from '../UploadReport'
import STTComboBox from '../STTComboBox'

/**
 * Reports is the home page for users to file a report.
 * The user can select a year
 * for the report that they would like to upload and then click on
 * `Search` to begin uploading files for that year.
 */
function Reports() {
  // The selected year in the dropdown tied to our redux `reports` state
  const selectedYear = useSelector((state) => state.reports.year)
  // The selected stt in the dropdown tied to our redux `reports` state
  const selectedStt = useSelector((state) => state.reports.stt)
  // The selected quarter in the dropdown tied to our redux `reports` state
  const selectedQuarter = useSelector((state) => state.reports.quarter)
  // The logged in user saved in our redux `auth` state object
  const user = useSelector((state) => state.auth.user)
  const isOFAAdmin =
    user && user.roles.some((role) => role.name === 'OFA Admin')
  const sttList = useSelector((state) => state.stts.sttList)

  const dispatch = useDispatch()
  const [isUploadReportToggled, setIsToggled] = useState(false)

  const [formHasErrors, setFormErrors] = useState(false)

  const quarters = {
    Q1: 'Quarter 1 (October - December)',
    Q2: 'Quarter 2 (January - March)',
    Q3: 'Quarter 3 (April - June)',
    Q4: 'Quarter 4 (July - September)',
  }

  const selectYear = ({ target: { value } }) => {
    setIsToggled(false)
    dispatch(setYear(value))
  }

  const handleSearch = () => {
    const isFormComplete = Boolean(
      selectedYear && selectedStt && selectedQuarter
    )

    if (isFormComplete) {
      setIsToggled(true)
    } else {
      // create error state
      setFormErrors(true)
    }
  }

  const selectQuarter = ({ target: { value } }) => {
    dispatch(setQuarter(value))
  }
  // Non-OFA Admin users will be unable to select an STT
  // prefer => `auth.user.stt`

  const selectStt = (value) => {
    dispatch(setStt(value))
  }

  const reportHeader = `${
    sttList?.find((stt) => stt?.name?.toLowerCase() === selectedStt)?.name
  } - Fiscal Year ${selectedYear} - ${quarters[selectedQuarter]}`

  return (
    <>
      <div className={classNames({ 'border-bottom': isUploadReportToggled })}>
        <form>
          {isOFAAdmin && (
            <div
              className={classNames('usa-form-group maxw-mobile margin-top-4', {
                'usa-form-group--error': formHasErrors && !selectedStt,
              })}
            >
              <STTComboBox
                selectedStt={selectedStt}
                selectStt={selectStt}
                error={formHasErrors && !selectedStt}
              />
            </div>
          )}

          <div
            className={classNames('usa-form-group maxw-mobile margin-top-4', {
              'usa-form-group--error': formHasErrors && !selectedYear,
            })}
          >
            <label
              className="usa-label text-bold margin-top-4"
              htmlFor="reportingYears"
            >
              Fiscal Year (October - September)
              {formHasErrors && !selectedYear && (
                <div
                  className="usa-error-message"
                  id="years-error-alert"
                  role="alert"
                >
                  A fiscal year is required
                </div>
              )}
              {/* eslint-disable-next-line */}
              <select
                className={classNames('usa-select maxw-mobile', {
                  'usa-combo-box__input--error': formHasErrors && !selectedYear,
                })}
                name="reportingYears"
                id="reportingYears"
                onChange={selectYear}
                value={selectedYear}
              >
                <option value="" disabled hidden>
                  - Select Fiscal Year -
                </option>
                <option value="2020">2020</option>
                <option data-testid="2021" value="2021">
                  2021
                </option>
              </select>
            </label>
          </div>
          <div
            className={classNames('usa-form-group maxw-mobile margin-top-4', {
              'usa-form-group--error': formHasErrors && !selectedQuarter,
            })}
          >
            <label
              className="usa-label text-bold margin-top-4"
              htmlFor="quarter"
            >
              Quarter
              {formHasErrors && !selectedQuarter && (
                <div
                  className="usa-error-message"
                  id="quarter-error-alert"
                  role="alert"
                >
                  A quarter is required
                </div>
              )}
              {/* eslint-disable-next-line */}
            <select
                className={classNames('usa-select maxw-mobile', {
                  'usa-combo-box__input--error':
                    formHasErrors && !selectedQuarter,
                })}
                name="quarter"
                id="quarter"
                onChange={selectQuarter}
                value={selectedQuarter}
              >
                <option value="" disabled hidden>
                  - Select Quarter -
                </option>
                {Object.entries(quarters).map(
                  ([quarter, quarterDescription]) => (
                    <option value={quarter} key={quarter}>
                      {quarterDescription}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
          <Button className="margin-y-4" type="button" onClick={handleSearch}>
            Search
          </Button>
        </form>
      </div>
      {isUploadReportToggled && (
        <UploadReport
          header={reportHeader}
          handleCancel={() => setIsToggled(false)}
        />
      )}
    </>
  )
}

export default Reports
