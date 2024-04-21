
const fs = require('fs');
const filePath = './dump/dump.txt';

const fileContents = fs.readFileSync(filePath, 'utf8');
const lines = fileContents.split('\n');

function parseObject(type, rows) {

	switch (type) {
		case "dump": {
			return parseDump(rows)
		}
		case "E-List": {
			return parseEList(rows)
		}
		case "Rates": {
			return parseRates(rows)
		}
		// case "Employee": {
		// 	return parseEmployee(rows)
		// }
		default: throw Error(`Unknown type: ${type}`);
	}
}

function parseEList(rows) {
	const eList = []
	let employeeRows = []
	for (let row of rows) {
			if (row.startsWith('  ')) {
				employeeRows.push(cutIndent(row))
			} else if (employeeRows.length > 0) {
				eList.push(parseEmployee(employeeRows))
				employeeRows = []
			}
	}
	if (employeeRows.length > 0) {
		eList.push(parseEmployee(employeeRows))
	}
	return eList;
}


function cutIndent(row) {
	if (row.startsWith('  ')) {
		return row.substring(2)
	} else {
		throw Error(`Row doesn't start with expected indent. Row[${row}]`);
	}
}

function parseDump(rows) {
	const eList = []
	const rates = []
	let curretField = null
	for (const row of rows) {
		if (row.trim().length == 0) {
			continue
		}
		if (row === 'E-List') {
			curretField = 'E-List'
		} else if (row === 'Rates') {
			curretField = 'Rates'
		} else {
			if (curretField === 'E-List') {
				eList.push(cutIndent(row))
			} else if (curretField === 'Rates') {
				rates.push(cutIndent(row))
			}
		}
	}
	return {
		"E-List": parseObject("E-List", eList),
		"Rates": parseObject("Rates", rates),
	}
}

function extractDigit(field, row) {
	const prefix = field + ':';
	if (row.startsWith(prefix)) {
		return Number(row.substring(prefix.length).trim())
	} else {
		throw Error(`Unexpected data. Field[${field}] - Row[${row}]`)
	}
}

function extractString(field, row) {
	const prefix = field + ':';
	if (row.startsWith(prefix)) {
		return row.substring(prefix.length).trim()
	} else {
		throw Error(`Unexpected data. Field[${field}] - Row[${row}]`)
	}
}



function parseEmployee(rows) {
	const result = {
		"id": null,
		"name": null,
		"surname": null,
		"department": {},
		"salary": {}
	}

	let subObjectBuffer = []
	let currentSubObject = null
	for (let row of rows) {
		if (row.startsWith("  ")) {
			subObjectBuffer.push(cutIndent(row))
		} else {
			if (subObjectBuffer.length > 0) {
				if (currentSubObject === 'Department') {
					result['department'] = parseDepartment(subObjectBuffer)
				} else if (currentSubObject === 'Salary') {
					result['salary'] = parseSalary(subObjectBuffer)
				} else if (currentSubObject === 'Donation') {
					result['donation'] = parseDonation(subObjectBuffer)
				}
			}

			if (row.startsWith("id:")) {
				result['id'] = extractDigit("id", row)
			} else if (row.startsWith("name:")) {
				result['name'] = extractString("name", row)
			} else if (row.startsWith("surname:")) {
				result['surname'] = extractString("surname", row)

			} else if (row.startsWith("Department")) {
				currentSubObject = 'Department'
				subObjectBuffer = []
			} else if (row.startsWith("Salary")) {
				currentSubObject = 'Salary'
				subObjectBuffer = []
			} else if (row.startsWith("Donation")) {
				currentSubObject = 'Donation'
				subObjectBuffer = []
			}

		}
	}

	return result
}



const result = parseObject('dump', lines)
console.log(result)
