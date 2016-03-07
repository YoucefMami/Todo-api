var person = {
	name: 'Youcef',
	age: 21
};

function updatePerson (obj) {
	obj.age = 33;
}

updatePerson(person);
console.log(person);

// Array example
var grades = [15, 17];

function addGrade (obj) {
	obj.push(19);
	debugger;
}

addGrade(grades);
console.log(grades);
