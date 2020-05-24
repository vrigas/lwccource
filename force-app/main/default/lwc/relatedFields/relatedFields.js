import { LightningElement, api, wire, track } from 'lwc'
import { updateRecord } from 'lightning/uiRecordApi'

export default class RelatedFields extends LightningElement {
  @api recordId
  @api masterField
  @api iconName
  @api title
  loading = false

  get masterFields () {
    return this.masterField && this.masterField.split(',')
  }

  async saveHandler () {
    let record = {
      Id: this.recordId
    }
    const children = this.template.querySelectorAll('c-related-fields-info')
    for(const child of children)
      record = { ...child.recordValues, ...record }

    this.loading = true

    try {
      await updateRecord({ fields: record})
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }
}