const db = require('../db/db')

class FileDAO{
	async uploadFile(employeesData) {
		// await db.insert(employeesData['Department']).into('Department')
		await db.insert(employeesData['Employee']).into('Employee')
		// await db.insert(employeesData['Salary']).into('Salary')
		// await db.insert(employeesData['Donation']).into('Donation')
	}

}

module.exports = new FileDAO()
