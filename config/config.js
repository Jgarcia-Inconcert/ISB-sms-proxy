require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3001,
  sms_queue_status: process.env.SMS_QUEUE_STATUS,
  sms_failed_status: process.env.SMS_FAILED_STATUS,
  sms_isb_url: process.env.SMS_ISB_URL,
  sms_username: process.env.SMS_USERNAME,
  sms_uuid: process.env.SMS_UUID,
}

module.exports = { config }