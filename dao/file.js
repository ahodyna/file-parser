const db = require('../db/db')

class FileDAO{
	async uploadFile(employeesData, ratesData) {
		await db.insert(employeesData['Department']).into('Department')
		await db.insert(employeesData['Employee']).into('Employee')
		await db.insert(employeesData['Salary']).into('Salary')
		await db.insert(employeesData['Donation']).into('Donation')
		await db.insert(ratesData).into('Rate')
	}
 async deleteFileContent(){
		// Removing all values from tables

	 await db('Department').del()
	 await db('Employee').del()
	 await db('Salary').del()
	 await db('Donation').del()
	 await db('Rate').del()
 }
}

module.exports = new FileDAO()
