# Test task

## Table of contents

- [Task 1](#task-1)
- [Task 2](#task-2)
- [Questions](#questions)

## Task 1

Objective: import the dump file into the DB.

### File format

A plain text format representing objects with properties and other nested
objects. The hierarchy is defined by indentation (each level 2 spaces).
The type of each object is named with a capital letter, properties - with a
small letter. The file contains a list of employees (Employee), each with basic
properties (first name, last name, ID). Also, each employee belongs to some
department (Department) and has a list of salaries (Statement) for the year.
The salary is defined by the date and amount (always in USD). An employee may
also have records of charitable contributions (Donation), the contribution
amount can be in any currency. In addition, the file contains the exchange
rates (Rate) for all date-currency pairs that were encountered in the
contributions. It is enough to store the equivalent of contributions in USD
in the database.
The dump file is attached.

## Task 2 (query)

Objective: create an API endpoint that performs the following calculations
in the DB and returns the results. All the calculations must be performed
in one SQL query.

For the employees who donated more than $100 to charity, calculate a one-time
reward equivalent to their contribution from the $10,000 pool.
For example, if an employee sent $200 out of a total of $1,000 donations,
he/she should receive 20% of the $10,000.
If employee contributions are less than $100, the value should be counted
towards the total, but the employee do not receive remuneration.

### Questions

Objective: demonstrate that the design desicions you made were solid by
answering the questions.

1. How to change the code to support different file versions?
2. How the import system will change if data on exchange rates disappears from
   the file, and it will need to be received asynchronously (via API)?
3. In the future the client may want to import files via the web interface,
   how can the system be modified to allow this?

### Answers

1. We can modify the parsing of incoming files by integrating version control. Upon receiving a file, the file version will be determined, and the parsing mode will switch accordingly, according to the file version.
2. If we retrieve currency exchange rate data directly from an official website (for example, from https://bank.gov.ua/ua/markets/exchangerates) using their API, it will suffice to save this data daily into our database after parsing it into the required format. We can then use this data similarly to how we currently import it from a file.
3. We can provide users with file import/export capabilities in their preferred formats by integrating a web interface on the frontend for file import and export. This will expand the functionality of our backend server by adding file handlers to handle requests, implementing logic for file import into the database, and export for sending reports to users.
   * Additionally, it's essential to consider the versions (structures) of data files that users import. If there are multiple versions with defined structures, we can use different versions of parsers as described in the previous response. If users submit data in various arbitrary formats, we could explore integrating a neural network that analyzes incoming files and converts them into the required structure.
