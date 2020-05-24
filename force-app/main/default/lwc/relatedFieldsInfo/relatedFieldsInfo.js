import { LightningElement, api, wire, track } from 'lwc'
import { getRecord } from 'lightning/uiRecordApi'
import { getObjectInfo } from 'lightning/uiObjectInfoApi'
import getFieldRelationInfo from '@salesforce/apex/RelatedFieldsCtrl.getFieldRelationInfo'

export default class RelatedFieldsInfo extends LightningElement {
  @api recordId
  @api masterField
  @track record
  objectApiName
  relatedFields
  relatedFieldsWithObject
  fieldsMetadata
  expanded = false

  async connectedCallback () {
    const relation = await getFieldRelationInfo({ recordId: this.recordId, masterField: this.masterField })
    this.objectApiName = relation.ObjectApiName__c
    this.relatedFields = relation.RelatedFields__c.replace(' ', '').split(';')
    this.relatedFieldsWithObject = this.relatedFields.map(f => `${this.objectApiName}.${f}`)
      .concat(`${this.objectApiName}.${this.masterField}`)
  }

  @wire(getObjectInfo, { objectApiName: '$objectApiName' })
  getObjectApiName ({ data, error }) {
    if (error)
      console.error(error)

    if (data)
      this.fieldsMetadata = data.fields
  }

  @wire(getRecord, { recordId: '$recordId', fields: '$relatedFieldsWithObject' })
  getRecordData ({ data, error }) {
    if (error)
      console.error(error)

    if (data) {
      this.record = {}
      Object.keys(data.fields).forEach(f => this.record[f] = data.fields[f].value)
    }
  }

  @api
  get recordValues () {
    return { ...this.record }
  }

  expandClick () {
    this.expanded = !this.expanded
  }

  handleNumberChange (event) {
    if (event.target.value && event.target.value.length) // '' = true
      this.record[event.target.dataset.name] = Number(event.target.value)
    else
      this.record[event.target.dataset.name] = null

    const sum = this.numberInfo.map(f => f.value).reduce((pre, cur) => pre + cur || 0, 0) || null
    // this.template.querySelector(`[data-name]=${this.masterField}`).value = sum
    this.record[this.masterField] = sum
  }

  handlePercentChange (event) {
    if (event.target.value && event.target.value.length)
      this.record[event.target.dataset.name] = Number(event.target.value)
    else
      this.record[event.target.dataset.name] = null
  }

  get masterInfo () {
    return this.record && this.fieldsMetadata && {
      apiName: this.masterField,
      label: this.fieldsMetadata[this.masterField].label,
      value: this.record[this.masterField]
    }
  }

  get masterReadOnly () {
    return this.numberInfo.map(f => f.value).reduce((pre, cur) => pre || cur, false)
  }

  get recordInfo () {
    return this.record && this.fieldsMetadata && Object.keys(this.record).filter(f => f !== this.masterField)
      .map(f => ({
        apiName: f,
        label: this.fieldsMetadata[f].label,
        value: this.record[f],
        isPercent: this.fieldsMetadata[f].dataType === 'Percent'
      }))
  }

  get numberInfo () {
    return this.recordInfo.filter(f => !f.isPercent)
  }

  get percentInfo () {
    return this.recordInfo.filter(f => f.isPercent)
  }

  get iconName () {
    return this.expanded ? 'utility:down' : 'utility:right'
  }

  get buttonClass () {
    return this.expanded ? 'rotatable rotated' : 'rotatable'
  }
}