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

  <!-- Firebase information -->

<!-- const firebaseConfig = {
  apiKey: "AIzaSyCBfX-4MVqZIdSgmSXeKPOQppzIYrEfl1Y",
  authDomain: "dlrs-13af7.firebaseapp.com",
  projectId: "dlrs-13af7",
  storageBucket: "dlrs-13af7.firebasestorage.app",
  messagingSenderId: "867838587828",
  appId: "1:867838587828:web:f7b1dd5a03780053fe78e1",
  measurementId: "G-TSFYMKJDJZ"
}; -->
