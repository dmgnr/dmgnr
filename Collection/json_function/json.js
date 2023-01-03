const edit = require('edit-json-file');
JSON.stringifyIt = (obj)=>{
    return(
        JSON.stringify(obj, function(key, value) {
            if (typeof value === "function") {
                return "/Function(" + value.toString() + ")/";
            }
            if(typeof value === "string"){
                return "/String(" + value.toString() + ")/"
            }
            return value;
        })
    )
}
JSON.parseIt=(json)=>{
    return(
        JSON.parse(json, function(key, value) {
            if (typeof value === "string" &&
            value.startsWith("/Function(") &&
            value.endsWith(")/")) {
                value = value.substring(10, value.length - 2);
                var string = value.slice(value.indexOf("(") + 1, value.indexOf(")"));
                if(/\S+/g.test(string)){
                    return (new Function(string,value.slice(value.indexOf("{") + 1, value.lastIndexOf("}"))))

                }else{
                    return (new Function(value.slice(value.indexOf("{") + 1, value.lastIndexOf("}"))));
                }
                
            }
            if (typeof value === "string" &&
            value.startsWith("/String(") &&
            value.endsWith(")/")){
                value = value.substring(8, value.length - 2);
            }
            return value;
        })
    )
}

// DEMO

var obj = {
    string:"a string",
    number:10,
    func:()=>{
        console.log("this is a string from a parsed json function");
    },
    secFunc:(none,ntwo)=>{console.log(none + ntwo)} ,
    confuse:"/Function(hello)/"
}
const stringifiedObj = JSON.stringifyIt(obj);
console.log("the stringified object is: ",stringifiedObj);
fs.writeFileSync('result.json',Buffer.from(stringifiedObj));
const parsedObj = JSON.parseIt(stringifiedObj);

// console.log("the parsed object is:  ",parsedObj);
console.log(parsedObj.string);
console.log(parsedObj.number);
console.log(parsedObj.confuse);
parsedObj.func();
parsedObj.secFunc(5,6);