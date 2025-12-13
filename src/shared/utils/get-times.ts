import moment from 'moment-timezone'
const getTime = (
  format: string = 'YYYY-MM-DD_HH-mm-ss',
  timezone: string = 'America/Sao_Paulo',
) => {
  return moment().tz(timezone).format(format)
}
export const times = {
  filename_now: getTime('YYYY-MM-DD_HH-mm-ss', 'America/Sao_Paulo'),
  now: getTime('YYYY-MM-DD HH:mm:ss', 'America/Sao_Paulo'),
  today: getTime('YYYY-MM-DD', 'America/Sao_Paulo'),
  month: getTime('YYYY-MM', 'America/Sao_Paulo'),
  year: getTime('YYYY', 'America/Sao_Paulo'),
  hour: getTime('HH', 'America/Sao_Paulo'),
  minute: getTime('mm', 'America/Sao_Paulo'),
  second: getTime('ss', 'America/Sao_Paulo'),
  timezone: 'America/Sao_Paulo',
}
export const { filename_now, now, today, month, year, hour, minute, second, timezone } = times
