import { LightningElement, api, track } from 'lwc'

export default class RelatedFields extends LightningElement {
  @api title
  @api iconName
  @api recordId
  @api masterFields

  get allMasterFields () {
    return this.masterFields.replace(' ', '').split(',')
  }
}