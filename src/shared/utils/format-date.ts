import moment from 'moment'

const format = ({
  date,
  timezone,
  format = 'DD/MM/YYYY',
}: {
  date: Date | string
  timezone?: string
  format?: string
}) => {
  const dateMoment = moment(date)
  if (timezone) {
    dateMoment.tz(timezone)
  }
  return dateMoment.format(format)
}

export const formatDate = (date: Date | string, timezone?: string) => {
  return format({ date, format: 'DD/MM/YYYY', timezone })
}

export const formatDateWithTime = (date: Date | string, timezone?: string) => {
  return format({ date, format: 'DD/MM/YYYY HH:mm:ss', timezone })
}
