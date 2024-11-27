# Clinic and Payment API

> Version 1.0.0

API for managing clinics, plans, and payments.

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| DELETE | [/deleteClinic/{id}](#deletedeleteclinicid) | Delete a clinic by ID |
| DELETE | [/deletePayment/{id}](#deletedeletepaymentid) | Delete a payment by ID |
| GET | [/getClinicById/{id}](#getgetclinicbyidid) | Get a clinic by ID |
| GET | [/getPaymentById/{id}](#getgetpaymentbyidid) | Get a payment by ID |
| GET | [/obtainAllClinics](#getobtainallclinics) | Retrieve all clinics |
| GET | [/obtainAllPayments](#getobtainallpayments) | Retrieve all payments |
| GET | [/obtainAllPlans](#getobtainallplans) | Retrieve all plans |
| POST | [/payment](#postpayment) | Process a payment |
| POST | [/registerClinic](#postregisterclinic) | Register a new clinic |
| POST | [/registerPayment](#postregisterpayment) | Register a new payment |
| PUT | [/updateClinic/{id}](#putupdateclinicid) | Update a clinic by ID |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| Clinic | [#/components/schemas/Clinic](#componentsschemasclinic) |  |
| Payment | [#/components/schemas/Payment](#componentsschemaspayment) |  |
| Plan | [#/components/schemas/Plan](#componentsschemasplan) |  |

## Path Details

***

### [DELETE]/deleteClinic/{id}

- Summary  
Delete a clinic by ID

- Description  
Deletes a specific clinic by its unique ID.

#### Responses

- 204 Clinic successfully deleted

- 404 Clinic not found

***

### [DELETE]/deletePayment/{id}

- Summary  
Delete a payment by ID

- Description  
Deletes a specific payment by its unique ID.

#### Responses

- 204 Payment successfully deleted

- 404 Payment not found

***

### [GET]/getClinicById/{id}

- Summary  
Get a clinic by ID

- Description  
Retrieve a specific clinic by its unique ID.

#### Responses

- 200 Clinic found

`application/json`

```ts
{
  // Unique identifier for the clinic
  _id?: string
  // Name of the clinic
  name?: string
  // City where the clinic is located
  city?: string
  // District of the clinic
  district?: string
  // Subscription plan of the clinic
  plan?: string
  // Status of the clinic
  active?: boolean
  // Postal code of the clinic
  postalCode?: string
  // ISO 3166-1 alpha-2 country code
  countryCode?: string
}
```

- 404 Clinic not found

***

### [GET]/getPaymentById/{id}

- Summary  
Get a payment by ID

- Description  
Retrieve a specific payment by its unique ID.

#### Responses

- 200 Payment found

`application/json`

```ts
{
  // Unique identifier for the payment
  _id?: string
  // Date of the payment
  date?: string
  // UUID of the clinic associated with the payment
  clinicId?: string
  // Status of the payment
  status?: enum[Pending, Completed, Failed]
  // UUID of the plan associated with the payment
  planId?: string
}
```

- 404 Payment not found

***

### [GET]/obtainAllClinics

- Summary  
Retrieve all clinics

- Description  
Returns a list of all registered clinics.

#### Responses

- 200 List of clinics

`application/json`

```ts
{
  // Unique identifier for the clinic
  _id?: string
  // Name of the clinic
  name?: string
  // City where the clinic is located
  city?: string
  // District of the clinic
  district?: string
  // Subscription plan of the clinic
  plan?: string
  // Status of the clinic
  active?: boolean
  // Postal code of the clinic
  postalCode?: string
  // ISO 3166-1 alpha-2 country code
  countryCode?: string
}[]
```

***

### [GET]/obtainAllPayments

- Summary  
Retrieve all payments

- Description  
Returns a list of all registered payments.

#### Responses

- 200 List of payments

`application/json`

```ts
{
  // Unique identifier for the payment
  _id?: string
  // Date of the payment
  date?: string
  // UUID of the clinic associated with the payment
  clinicId?: string
  // Status of the payment
  status?: enum[Pending, Completed, Failed]
  // UUID of the plan associated with the payment
  planId?: string
}[]
```

***

### [GET]/obtainAllPlans

- Summary  
Retrieve all plans

- Description  
Returns a list of all registered plans.

#### Responses

- 200 List of plans

`application/json`

```ts
{
  // Unique identifier for the plan
  _id?: string
  // Name of the plan
  name?: string
  // Price of the plan
  price?: number
  features?: string[]
}[]
```

***

### [POST]/payment

- Summary  
Process a payment

- Description  
Endpoint to process a payment, save the payment data, and activate the clinic.

#### RequestBody

- application/json

```ts
{
  // ID of the clinic making the payment.
  clinicId?: string
  // ID of the plan being paid for.
  planId?: string
}
```

#### Responses

- 200 Payment processed successfully.

`application/json`

```ts
{
  message?: string
  // Information about the payment intent created by Stripe.
  paymentIntent: {
  }
}
```

- 400 Error processing payment.

`application/json`

```ts
{
  error?: string
}
```

- 404 Plan not found.

`application/json`

```ts
{
  error?: string
}
```

***

### [POST]/registerClinic

- Summary  
Register a new clinic

- Description  
Creates a new clinic and saves it in the database.

#### RequestBody

- application/json

```ts
{
  // Name of the clinic
  name: string
  // City where the clinic is located
  city: string
  // District of the clinic
  district: string
  // Subscription plan of the clinic
  plan: string
  // Status of the clinic
  active: boolean
  // Postal code of the clinic
  postalCode: string
  // ISO 3166-1 alpha-2 country code
  countryCode: string
}
```

#### Responses

- 201 Clinic successfully created

- 400 Invalid input data

***

### [POST]/registerPayment

- Summary  
Register a new payment

- Description  
Creates a new payment and saves it in the database.

#### RequestBody

- application/json

```ts
{
  // Date of the payment
  date: string
  // UUID of the clinic
  clinicId: string
  // Status of the payment
  status: enum[Pending, Completed, Failed]
  // UUID of the plan
  planId: string
}
```

#### Responses

- 201 Payment successfully created

- 400 Invalid input data

***

### [PUT]/updateClinic/{id}

- Summary  
Update a clinic by ID

- Description  
Updates a clinic's details based on its unique ID.

#### RequestBody

- application/json

```ts
{
  // Updated name of the clinic
  name?: string
  // Updated city where the clinic is located
  city?: string
  // Updated district of the clinic
  district?: string
  // Updated subscription plan of the clinic
  plan?: string
  // Updated status of the clinic
  active?: boolean
  // Updated postal code of the clinic
  postalCode?: string
  // Updated ISO 3166-1 alpha-2 country code
  countryCode?: string
}
```

#### Responses

- 200 Clinic successfully updated

`application/json`

```ts
{
  // Unique identifier for the clinic
  _id?: string
  // Name of the clinic
  name?: string
  // City where the clinic is located
  city?: string
  // District of the clinic
  district?: string
  // Subscription plan of the clinic
  plan?: string
  // Status of the clinic
  active?: boolean
  // Postal code of the clinic
  postalCode?: string
  // ISO 3166-1 alpha-2 country code
  countryCode?: string
}
```

- 400 Invalid input data

- 404 Clinic not found

## References

### #/components/schemas/Clinic

```ts
{
  // Unique identifier for the clinic
  _id?: string
  // Name of the clinic
  name?: string
  // City where the clinic is located
  city?: string
  // District of the clinic
  district?: string
  // Subscription plan of the clinic
  plan?: string
  // Status of the clinic
  active?: boolean
  // Postal code of the clinic
  postalCode?: string
  // ISO 3166-1 alpha-2 country code
  countryCode?: string
}
```

### #/components/schemas/Payment

```ts
{
  // Unique identifier for the payment
  _id?: string
  // Date of the payment
  date?: string
  // UUID of the clinic associated with the payment
  clinicId?: string
  // Status of the payment
  status?: enum[Pending, Completed, Failed]
  // UUID of the plan associated with the payment
  planId?: string
}
```

### #/components/schemas/Plan

```ts
{
  // Unique identifier for the plan
  _id?: string
  // Name of the plan
  name?: string
  // Price of the plan
  price?: number
  features?: string[]
}
```