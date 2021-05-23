let text = "hello i'am 'name' i stydend";
let result = text.replace(/(?<=\s)\'(?=\w+)|(?<=\w)\'(?=\s|\.)/g, '"');
alert(`${result}`);
