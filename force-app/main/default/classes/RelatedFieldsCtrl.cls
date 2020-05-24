public with sharing class RelatedFieldsCtrl {
  @AuraEnabled
  public static FieldRelation__mdt getFieldRelationInfo(String masterField, Id recordId) {
    String department = '';
    if(recordId.getSobjectType() == Contact.getSObjectType()) {
      department = [
        SELECT department
        FROM Contact
        WHERE Id =: recordId
      ].Department;
    }

    List<FieldRelation__mdt> relation = [
      SELECT ObjectApiName__c, RelatedFields__c
      FROM FieldRelation__mdt
      WHERE MasterField__c =: masterField
      AND Department__c =: department
    ];

    if (relation.size() == 0) {
      relation = [
        SELECT ObjectApiName__c, RelatedFields__c
        FROM FieldRelation__mdt
        WHERE MasterField__c =: masterField
      ];
    }

    if(relation.size() == 0)
      throw new AuraHandledException('No settings');

    return relation[0];
  }

  @AuraEnabled(cacheable=true)
  public static Id contactInCharge(Id recordId){
    return [
      SELECT Id
      FROM Contact
      WHERE AccountId =: recordId
      AND IsInCharge__c = true
    ].Id;
  }
}
