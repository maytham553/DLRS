# Tasks

##Setup the project

- [x] create react project
- [x] create repo
- [x] create firebase project
- [x] install libraries

  - [x] chakra ui
  - [x] react router
  - [x] react hook form
  - [x] firebase

- [x] clean up the project

## Authentication System 🔐

- [ ] Login/Logout Agents using Firebase Authentication

- [ ] Register IDP application

- [x] Define all data models

  - IDP

    - Id (required, unique)
    - status [valid, cancelled, expired] (default: valid , required)
    - firstName (required)
    - familyName (required)
    - phoneNumber (optional)
    - gender (required)
    - birthDate (required)
    - birthPlace (required)
    - licenseNumber (required)
    - licenseClass [A, B, C, D, E] (required)
    - issuerCountry (required)
    - addressLine1 (required)
    - addressLine2 (optional)
    - city (required)
    - state (required)
    - zipCode (required)
    - country (required)
    - residenceCountry (required)
    - duration [1, 3] (required)
    - requestIdCard (boolean) (required)
    - personalPhoto (required)
    - licenseFrontPhoto (required)
    - licenseBackPhoto (required)
    - termsAccepted (required)
    - issueDate (required)
    - expiryDate (required)
    - idpNumber (required, format: nanoid yymmddxxxxxx , unique)

  - Agent
    - Id (required, unique)
    - name (required)
    - userName (required, unique)
    - email (required, unique)
    - password (required)

- [ ] Public Search For IDP

- [ ] Login/Logout

- [ ] Edit IDP application

- [ ] List For IDPs

- [ ] Print IDP ID

- [ ] Print IDP Card

- [ ] Public Website (low priority)

- [ ] Public IDP application (by customers) (low priority)
