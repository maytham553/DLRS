# Product Requirement Document

## Overview

This project is a web application that facilitates the following functionalities:

- agents to manage IDP applications,
- anonymous users to submit data via WhatsApp,
- searching for IDPs created within the system.
- simple landing page to explain the service and the benefits

## IDP

idp is international driver permit.

it contains the following information:

- personal information

  - first name
  - family name
  - phone number (optional)
  - gender (male or female)
  - date of birth
  - place of birth

- driving license information

  - license number
  - license class
    - options: A, B, C, D, E
  - issuer country

- address

  - address line 1
  - address line 2
  - city
  - state
  - zipcode
  - country
  - residence country

- IDP application information
  - duration
    - options: 1 year
    - options: 3 years
  - ID Card request (true, false)
  - Personal photo
  - Front of the driving license photo
  - Back of the driving license photo
  - Terms and conditions
  - Issue Date
  - Expiry Date
  - IDP Number

## Tasks

- [ ] Setup the project

  - create react project
  - create repo
  - create firebase project
  - install libraries
    - chakra ui
    - react router
    - react hook form
    - firebase

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
