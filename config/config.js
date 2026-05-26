require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3001,
  sms_queue_status: process.env.SMS_QUEUE_STATUS,
  sms_failed_status: process.env.SMS_FAILED_STATUS,
  sms_infobip_url: process.env.SMS_INFOBIP_URL,
  sms_username: process.env.SMS_USERNAME,
  sms_password: process.env.SMS_PASSWORD,
}

module.exports = { config }