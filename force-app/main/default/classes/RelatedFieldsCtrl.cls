public with sharing class RelatedFieldsCtrl {
  @AuraEnabled
  public static FieldRelation__mdt getRelatedFields(String masterField, Id recordId){
    String department = '';

    if (recordId.getSobjectType() === Contact.getSObjectType()) {
      department = [
        SELECT Department
        FROM Contact
        WHERE Id =: recordId
      ].Department;
    }

    List<FieldRelation__mdt> relations = [
      SELECT ObjectApiName__c, RelatedFields__c
      FROM FieldRelation__mdt
      WHERE MasterField__c =: masterField
      AND Department__c =: department
    ];

    if (relations.size() == 0) {
      relations = [
        SELECT ObjectApiName__c, RelatedFields__c
        FROM FieldRelation__mdt
        WHERE MasterField__c =: masterField
      ];
    }

    if (relations.size() == 0)
      throw new AuraHandledException('Custom settings error!');

    return relations[0];
  }
}
