const fileService = require('../service/file')

class FileController {
	async uploadFile(req, res) {
		try {
			await fileService.uploadFile(req)
			res.send('OK');
		}
		catch (err) {
			console.error(err)
		}
	}

	async deleteFileContent(req, res) {
		try {
			await fileService.deleteFileContent(req)
			res.send('OK');
		}
		catch (err) {
			console.error(err)
		}
	}
}

module.exports = new FileController();
