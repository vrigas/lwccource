import { LightningElement, api, wire } from 'lwc'
import getRelatedFields from '@salesforce/apex/RelatedFieldsCtrl.getRelatedFields'
import { getObjectInfo } from 'lightning/uiObjectInfoApi'
import { getRecord } from 'lightning/uiRecordApi'

export default class RelatedFieldsInfo extends LightningElement {
  @api recordId
  @api masterField
  fieldMetadata
  objectApiName
  fields
  expanded = false

  async connectedCallback () {
    const result = await getRelatedFields({ masterField: this.masterField, recordId: this.recordId })
    this.objectApiName = result.ObjectApiName__c
    this.fields = result.RelatedFields__c.split(';').map(f => this.objectApiName + '.' + f)
      .concat([this.objectApiName + '.' + this.masterField])
  }

  // 1. Get Object metadata
  @wire(getObjectInfo, { objectApiName: '$objectApiName' })
  wiredAccountMetadata ({ data, error }) {
    if(data) {
      this.fieldMetadata = data.fields
    }

    if(error)
      console.error(error)
  }

  // 2. Get record values
  @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
  wiredAccount ({data, error}) {
    if(data) {
      console.log(data)
    }

    if(error)
      console.error(error)
  }



  clickHandler () {
    this.expanded = !this.expanded
  }

  get buttonIcon () {
    return this.expanded ? 'utility:down' : 'utility:right'
  }

  get loading () {
    return !this.fieldMetadata
  }
}