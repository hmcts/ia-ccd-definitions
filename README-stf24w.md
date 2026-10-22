# IA CCD Definitions

### Purpose
To enable the stf24w actions 

Add below cahnges to  AuthorisationCaseEvent.json these will enables the stf24w actions to perform in the XUI

  {"LiveFrom": "01/01/2018", "CaseTypeID": "Asylum", "CaseEventID": "addStatutoryTimeframe24Weeks", "UserRole": "caseworker-ia-caseofficer", "CRUD": "CRUD"},
  {"LiveFrom": "01/01/2018", "CaseTypeID": "Asylum", "CaseEventID": "addStatutoryTimeframe24Weeks", "UserRole": "caseworker-ia-admofficer", "CRUD": "CRUD"},
  {"LiveFrom": "01/01/2018", "CaseTypeID": "Asylum", "CaseEventID": "addStatutoryTimeframe24Weeks", "UserRole": "caseworker-ia-iacjudge", "CRUD": "CRUD"},
  {"LiveFrom": "01/01/2018", "CaseTypeID": "Asylum", "CaseEventID": "removeStatutoryTimeframe24Weeks", "UserRole": "caseworker-ia-iacjudge", "CRUD": "CRUD"},
  {"LiveFrom": "01/01/2018", "CaseTypeID": "Asylum", "CaseEventID": "addStatutoryTimeframe24Weeks", "UserRole": "caseworker-ia-system", "CRUD": "CRUD"},
  {"LiveFrom": "01/01/2018", "CaseTypeID": "Asylum", "CaseEventID": "removeStatutoryTimeframe24Weeks", "UserRole": "caseworker-ia-system", "CRUD": "CRUD"}

Make sure these are removed from the code before merge the changes in to the master branch.
