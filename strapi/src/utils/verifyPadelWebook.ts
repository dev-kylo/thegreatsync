import { PaddleFulfillment } from "../../custom-types";

const crypto = require('crypto');
const Serialize = require('php-serialize');

function ksort(obj){
    const keys = Object.keys(obj).sort();
    let sortedObj = {};
    for (let i in keys) {
      sortedObj[keys[i]] = obj[keys[i]];
    }
    return sortedObj;
}

export function validateWebhook(jsonObj: Partial<PaddleFulfillment>, pubKey: string) {
    console.log(pubKey)
    console.log(jsonObj.p_signature)
    // Grab p_signature
    console.log('starting verify')
    const mySig = Buffer.from(jsonObj.p_signature, 'base64');
    // Remove p_signature from object - not included in array of fields used in verification.
    delete jsonObj.p_signature;
    // Need to sort array by key in ascending order
    jsonObj = ksort(jsonObj);
    for (let property in jsonObj) {
        if (jsonObj.hasOwnProperty(property) && (typeof jsonObj[property]) !== "string") {
            if (Array.isArray(jsonObj[property])) { // is it an array
                jsonObj[property] = jsonObj[property].toString();
            } else { //if its not an array and not a string, then it is a JSON obj
                jsonObj[property] = JSON.stringify(jsonObj[property]);
            }
        }
    }
    // Serialise remaining fields of jsonObj
    const serialized = Serialize.serialize(jsonObj);
    // verify the serialized array against the signature using SHA1 with your public key.
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();

    const verification = verifier.verify(pubKey, mySig);
    // Used in response if statement
    return verification;
}