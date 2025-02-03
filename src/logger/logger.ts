import winston from 'winston'
import config from '../config/env'

const { combine, timestamp, printf, colorize, errors, label } = winston.format

winston.addColors({
  error: 'red bold',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
})

const lightThemeFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
  })
)

const darkThemeFormat = combine(
  colorize({ all: true }),
  label({ label: 'user-management-api' }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, label, level, message, stack }) => {
    return `${timestamp} [${label}] ${level}: ${stack || message}`
  })
)

const selectedTheme = config.LOG_THEME
const chosenFormat =
  selectedTheme === 'dark' ? darkThemeFormat : lightThemeFormat

const logger = winston.createLogger({
  level: 'info',
  format: chosenFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

export default logger
