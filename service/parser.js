const fs = require('fs');
class ParserObjectDescriptor {
	constructor(fieldsDescriptors, subobjects) {
		this.fieldsDescriptors = fieldsDescriptors;
		this.subobjects = subobjects;
	}
}


const types = {
	".": new ParserObjectDescriptor(
			{},
			["E-List", "Rates"]),
	"E-List": new ParserObjectDescriptor(
			{},
			["Employee"]),
	"Employee": new ParserObjectDescriptor(
			{
				"id": "number",
				"name": "string",
				"surname": "string"
			},
			["Department", "Salary", "Statement"]),
	"Department": new ParserObjectDescriptor(
			{
				"id": "number",
				"name": "string"
			},
			[]),
	"Car": new ParserObjectDescriptor(
			{
				"id": "number",
				"name": "string"
			},
			[]),
	"Salary": new ParserObjectDescriptor(
			{},
			["Statement"]),
	"Statement": new ParserObjectDescriptor(
			{
				"id": "number",
				"date": "date",
				"amount": "currency"
			},
			[]),
	"Donation": new ParserObjectDescriptor(
			{
				"id": "number",
				"date": "date",
				"amount": "currency"
			},
			[]),
	"Rates": new ParserObjectDescriptor(
			{},
			["Rate"]),
	"Rate": new ParserObjectDescriptor(
			{
				"date": "date",
				"sign": "string",
				"value": "number"
			},
			[]),
}

function parseValue(value, type) {
	if (type === "string") {
		return value.trim()
	} else if (type === "number") {
		return Number(value.trim())
	} else if (type === "date") {
   	const normalizedDate = 	new Date(value.trim()).toDateString()
		return  normalizedDate || value.trim();
	} else if (type === "currency") {
		return value.trim()
	} else {
		throw Error(`Can't parse value[${value}] of unexpected type${type}`)
	}
}

function cutIndent(row) {
	if (row.startsWith('  ')) {
		return row.substring(2)
	} else {
		throw Error(`Row doesn't start with expected indent. Row[${row}]`);
	}
}

function submitDuplicatableObject(storage, name, instance) {
	if (name in storage) {
		if (Array.isArray(storage[name])) {
			storage[name].push(instance)
		} else {
			storage[name] = [storage[name]]
			storage[name].push(instance)
		}
	} else {
		storage[name] = instance
	}
}

function parseObject(type, rows) {
	if (!type in types) {
		throw new Error(`Type[${type}] not found in type descriptors`)
	}

	let objectDescriptor = types[type];
	if (objectDescriptor == undefined) {
		throw Error(`Missed descriptor for type[${type}]`)
	}

	const objectResult = {}
	let currentSubObject = null
	let currentSubObjectBuffer = []

	for (let row of rows) {
		if (row.trim().length == 0) {
			continue
		}

		if (row.startsWith("  ")) {
			currentSubObjectBuffer.push(cutIndent(row))
		} else {
			if (currentSubObjectBuffer.length > 0) {
				const parsedObj = parseObject(currentSubObject, currentSubObjectBuffer)
				submitDuplicatableObject(objectResult, currentSubObject, parsedObj)
				currentSubObjectBuffer = []
				currentSubObject = null
			}

			const ownFieldDelimiter = row.indexOf(":")

			if (ownFieldDelimiter === -1) { // not a field but sub new subObject start
				currentSubObject = row.trim()

			} else {  // regular field
				let [fieldName, fieldValue] = row.split(":")
				const fieldType = objectDescriptor.fieldsDescriptors[fieldName]
				objectResult[fieldName] = parseValue(fieldValue, fieldType)
			}
		}
	}

	if (currentSubObjectBuffer.length > 0) {
		const parsedObj = parseObject(currentSubObject, currentSubObjectBuffer)
		submitDuplicatableObject(objectResult, currentSubObject, parsedObj)
	}

	return objectResult;
}

function prepareEmployeesDataToInsert(employees){
	const employeesData = [];
	const employeeIds = new Set()
	const departments = [];
	const departmentIds = new Set();
	const salaries = [];
	const donations = []

	employees.forEach(employee => {
		if (employee.id) {
			if (!employeeIds.has(employee.id)) {
				employeeIds.add(employee.id)
				employeesData.push({
					id: employee.id,
					name: employee.name,
					surname: employee.surname,
					department_id: employee["Department"].id
				});

				if (!departmentIds.has(employee["Department"].id)) {
					departmentIds.add(employee["Department"].id)
					departments.push(employee["Department"]);
				}

				if (employee["Salary"]["Statement"]){
				employee["Salary"]["Statement"].forEach((salary) => salaries.push({id: salary.id, amount: Number(salary.amount), date: salary.date, 'employee_id': employee.id}))
				}

				if (employee["Donation"]){
			  	if(Array.isArray(employee["Donation"])){
					  employee["Donation"].forEach((donation) => {
						  const amountWithCurrency = donation.amount.split(" ");
							const amount = Number(amountWithCurrency[0]);
							const currency = String(amountWithCurrency[1]);
							donations.push({...donation, amount: amount, currency: currency, 'employee_id': employee.id})})
		  		}else{
					  const amountWithCurrency = employee["Donation"].amount.split(" ");
					  const amount = Number(amountWithCurrency[0]);
					  const currency = String(amountWithCurrency[1]);
					  employee["Donation"].amount = amount;
					  employee["Donation"].currency = currency;
					  employee["Donation"]['employee_id'] =  employee.id;
					  donations.push(employee["Donation"])
				  }
				}
			}
		 }
		}
	)

	return {
		'Department': departments,
		'Employee': employeesData,
		'Salary': salaries,
		'Donation': donations
	}
}

module.exports = {prepareEmployeesDataToInsert, parseObject}
