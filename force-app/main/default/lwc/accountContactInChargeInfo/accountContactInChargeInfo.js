import { LightningElement, api, wire } from 'lwc'
import contactInCharge from '@salesforce/apex/RelatedFieldsCtrl.contactInCharge'
export default class AccountContactInChargeInfo extends LightningElement {
  @api recordId

  @wire(contactInCharge, {recordId: '$recordId'})
  wiredContactId

  get contactId () {
    return this.wiredContactId && this.wiredContactId.data
  }
}