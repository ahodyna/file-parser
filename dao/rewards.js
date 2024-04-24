const db = require('../db/db')

class RewardsDAO {
	async calculateRewards() {
		const result = await db.raw(`SELECT e.id, e.name, d.date, 
       SUM(d.amount * r.value) AS total_donation_in_usd
       FROM "Employee" e
       JOIN "Donation" d ON e.id = d.employee_id
       JOIN "Rate" r ON d.currency = r.sign
       WHERE d.amount > 100
       AND r.date = (
         SELECT MAX(date)
         FROM "Rate"
         WHERE sign = d.currency AND date <= d.date
       )
     GROUP BY e.id, e.name, d.date
     HAVING SUM(d.amount * r.value) > 100
      `)

		return result
	}
}

module.exports = new RewardsDAO()
