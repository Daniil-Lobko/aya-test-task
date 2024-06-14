export const parseData = (data) => {
  const lines = data.split('\n');
  const employees = [];
  let currentEmployee = null;
  let currentSection = null;

  let lineCount = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('Employee')) {
      if (currentEmployee) employees.push(currentEmployee);
      currentEmployee = { salaries: [], donations: [] };
      currentSection = 'employee';
    } else if (trimmed.startsWith('Department')) {
      currentEmployee.department = {};
      currentSection = 'department';
    } else if (trimmed.startsWith('Statement')) {
      currentSection = 'statement';
      currentEmployee.salaries.push({});
    } else if (trimmed.startsWith('Donation')) {
      currentSection = 'donation';
      currentEmployee.donations.push({});
    } else if (currentSection === 'employee' && trimmed) {
      const [key, value] = trimmed.split(': ').map((v) => v.trim());
      if (key === 'id') {
        currentEmployee![key] = Number(value);
      } else {
        currentEmployee![key] = value;
      }
    } else if (currentSection === 'department' && trimmed) {
      const [key, value] = trimmed.split(': ').map((v) => v.trim());
      if (key !== 'Salary') {
        if (key === 'id') currentEmployee.department[key] = Number(value);
        else currentEmployee.department[key] = value;
      }
    } else if (currentSection === 'statement' && trimmed) {
      const [key, value] = trimmed.split(': ').map((v) => v.trim());
      if (key === 'id' || key === 'amount')
        currentEmployee!.salaries![currentEmployee!.salaries!.length - 1][key] = Number(value);
      else if (key === 'date') currentEmployee!.salaries![currentEmployee!.salaries!.length - 1][key] = value;
    } else if (currentSection === 'donation' && trimmed) {
      const [key, value] = trimmed.split(': ').map((v) => v.trim());
      if (key === 'amount') {
        const amountMatch = value.match(/^(\d+(\.\d{1,2})?)\s([A-Z]{3})$/);
        if (amountMatch) {
          currentEmployee.donations[currentEmployee.donations.length - 1]['amount'] = parseFloat(amountMatch[1]);
          currentEmployee.donations[currentEmployee.donations.length - 1]['sign'] = amountMatch[3];
        }
      } else if (key === 'date') {
        currentEmployee.donations[currentEmployee.donations.length - 1]['date'] = value;
      } else {
        currentEmployee.donations[currentEmployee.donations.length - 1][key] = value;
      }
    }
  });

  if (currentEmployee) employees.push(currentEmployee);

  return employees;
};

type ExchangeRate = {
  date: string;
  sign: string;
  value: number;
};

export const parseRates = (data) => {
  const lines = data.split('\n');
  const rates: ExchangeRate[] = [];
  let currentRate: Partial<ExchangeRate> = {};

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('Rate')) {
      if (currentRate.date && currentRate.sign && currentRate.value) {
        rates.push(currentRate as ExchangeRate);
      }
      currentRate = {};
    } else if (trimmed.startsWith('date:')) {
      currentRate.date = trimmed.split(': ').slice(1).join(': ').trim();
    } else if (trimmed.startsWith('sign:')) {
      currentRate.sign = trimmed.split(': ').slice(1).join(': ').trim();
    } else if (trimmed.startsWith('value:')) {
      currentRate.value = parseFloat(trimmed.split(': ').slice(1).join(': ').trim());
    }
  });

  if (currentRate.date && currentRate.currency && currentRate.value) {
    rates.push(currentRate as ExchangeRate);
  }

  return rates;
};
