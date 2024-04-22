const FileDAO = require('../dao/file')
const fs = require("fs");
const {parseObject, prepareEmployeesDataToInsert} = require("./parser");

class FileService{
	async uploadFile(data){
		console.log('data', data)
	  // For testing, we access the file from the folder dump.
		// TODO: Implement by accepting this file from the client.
		const filePath = './dump/dump.txt'
		const fileContents = fs.readFileSync(filePath, 'utf8');
		const lines = fileContents.split('\n');
		const result = parseObject('.', lines)
		const employeesData = prepareEmployeesDataToInsert(result["E-List"]["Employee"])

	await	FileDAO.uploadFile(employeesData)
	}
}

module.exports = new FileService()
