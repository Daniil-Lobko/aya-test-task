import fs from 'fs';
import { parseData, parseRates } from '../helpers/parseData';
import { pool } from '../db';

export class TaskService {
  async fillDatabase() {
    fs.readFile('./dump.txt', 'utf8', async (err, data) => {
      if (err) throw err;

      const employees = parseData(data);
      const exchangeRates = parseRates(data);

      for (const employee of employees) {
        const { id, name, surname, department, salaries, donations } = employee;
        const departmentResult = await pool.query(
          'INSERT INTO Departments (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING RETURNING id',
          [department.id, department.name],
        );

        const departmentId = departmentResult.rows[0]?.id || department.id;

        await pool.query(
          'INSERT INTO Employees (id, name, surname, department_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [id, name, surname, departmentId],
        );

        for (const salary of salaries) {
          await pool.query(
            'INSERT INTO Salaries (id, employee_id, amount, date) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
            [salary.id, id, salary.amount, salary.date],
          );
        }

        for (const rate of exchangeRates) {
          const { date, sign, value } = rate;
          await pool.query(
            'INSERT INTO ExchangeRates (date, sign, value) VALUES ($1, $2, $3) ON CONFLICT (date) DO NOTHING',
            [date, sign, value],
          );
        }

        for (const donation of donations) {
          try {
            if (donation.sign === 'USD') {
              await pool.query(
                'INSERT INTO Donations (employee_id, amount, sign) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                [id, donation.amount, donation.sign],
              );
            } else {
              await pool.query(
                'INSERT INTO Donations (employee_id, amount, date, sign) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
                [id, donation.amount, donation.date, donation.sign],
              );
            }
          } catch (error) {
            console.error(`Error inserting donation with id ${donation.id}:`, error.message);
            continue;
          }
        }
      }
      return { success: true };
    });
  }

  async calculateReward() {
    const query = `
            WITH TotalDonations AS (SELECT d.employee_id,
                                           SUM(
                                                   CASE
                                                       WHEN d.sign = 'USD' THEN d.amount
                                                       ELSE d.amount * COALESCE(er.value, 1)
                                                       END
                                               ) AS total_donation_sum
                                    FROM Donations d
                                             LEFT JOIN ExchangeRates er ON d.date = er.date AND d.sign = er.sign
                                    GROUP BY d.employee_id),
                 DonationShare AS (SELECT td.employee_id,
                                          td.total_donation_sum,
                                          CASE
                                              WHEN td.total_donation_sum > 100
                                                  THEN (td.total_donation_sum / t.total_donation) * 10000
                                              ELSE 0
                                              END AS reward
                                   FROM TotalDonations td
                                            CROSS JOIN (SELECT COALESCE(SUM(total_donation_sum), 1) AS total_donation
                                                        FROM TotalDonations) t)
            SELECT e.id                               AS employee_id,
                   e.name,
                   e.surname,
                   e.department_id,
                   COALESCE(td.total_donation_sum, 0) AS total_donation_sum,
                   COALESCE(ds.reward, 0)             AS reward
            FROM Employees e
                     LEFT JOIN TotalDonations td ON e.id = td.employee_id
                     LEFT JOIN DonationShare ds ON e.id = ds.employee_id
            WHERE COALESCE(td.total_donation_sum, 0) >= 100;
        `;
    const list = await pool.query(query);
    return list.rows;
  }
}
