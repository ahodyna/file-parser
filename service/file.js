const fs = require("fs");

const FileDAO = require('../dao/file')
const {parseObject, prepareEmployeesDataToInsert} = require("./parser");

class FileService {
	async uploadFile(data) {
		// For testing, we access the file from the folder dump.
		// TODO: Implement by accepting this file from the client.
		const filePath = './dump/dump.txt'
		const fileContents = fs.readFileSync(filePath, 'utf8');
		const lines = fileContents.split('\n');
		const result = parseObject('.', lines)
		const employeesData = prepareEmployeesDataToInsert(result["E-List"]["Employee"])
		const ratesData = result['Rates']['Rate']

		await FileDAO.uploadFile(employeesData, ratesData)
	}

	async deleteFileContent(data) {

		await FileDAO.deleteFileContent()
	}
}

module.exports = new FileService()
