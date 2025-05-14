export const schema = {
  "tables": {
    "grievances": {
      "type": "collection",
      "fields": {
        "title": {
          "type": "string",
          "indexed": true
        },
        "description": {
          "type": "string",
          "indexed": true
        },
        "status": {
          "type": "string",
          "indexed": true
        },
        "priority": {
          "type": "string",
          "indexed": true
        },
        "createdAt": {
          "type": "string",
          "indexed": true
        },
        "category": {
          "type": "string",
          "indexed": true
        }
      }
    }
  },
  "version": 2,
  "project_id": "dd2b054f-e8d0-4772-bfa2-e4d427f2b5c6"
};