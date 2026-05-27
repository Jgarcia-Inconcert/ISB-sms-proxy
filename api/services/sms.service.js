const fetch = require('node-fetch');
const { config } = require('../../config/config');

class SMSService {

     constructor() { }

     async send(request) {

          let reason = "";
          let error = false;


          const baseUrl = config.sms_isb_url;
          const username = config.sms_username;
          const uuid = config.sms_uuid;

          const sms_failed_status = config.sms_failed_status;
          const sms_queue_status = config.sms_queue_status;

          console.log('[DEBUG] Request SMSService: ', JSON.stringify(request, null, 2));

          // Validate request
          if (!request.addresses || request.addresses.length === 0) {
               console.log('[ERROR] El telofono es requerido');
               // Retorno error
               reason = "El telofono es requerido";

               error = true;
          }

          if (!request.message) {
               console.log('[ERROR] El mensaje es requerido');
               // Retorno error
               reason = "El mensaje es requerido";

               error = true;
          }

          const message = request.message.text;

          let resp = {
               status: false,
               reason: reason,
               addresses: {}
          };

          for (var address of request.addresses) {
               if (address) {
                    if (!error) {
                         const encodedMessage = encodeURIComponent(message);
                         let url = `${baseUrl}${uuid}/${username}?phone=${address}&message=${encodedMessage}`;
                         console.log('[DEBUG] URL request ISB: ', url);
                         const response = await fetch(url);
                         const data = await response.text();

                         const parts = data.split(' ');

                         const statusCode = parts[0];
                         const statusText = parts[1];

                         console.log('[DEBUG] Response ISB: ', JSON.stringify(data, null, 2));

                         if (statusCode === '200' && statusText === 'Recibido') {
                              resp.status = true;
                              resp.reason = "";
                              resp.addresses[address] = {
                                   status: sms_queue_status,
                                   reason: ""
                              };
                         } else {
                              resp.addresses[address] = {
                                   status: sms_failed_status,
                                   reason: data
                              };
                         }

                    } else {
                         resp.addresses[address] = {
                              status: sms_failed_status,
                              reason: reason
                         }
                    }
               }
          }
          return resp;
     }
}

module.exports = SMSService;