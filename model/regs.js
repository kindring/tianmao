let regs = [
    {
        reg:/^\d{9,16}$/,
        fields:['account']
    },
    {
        reg:/^\w{8,16}$/,
        fields:['password']
    },
    {
        reg:/^\d+$/,
        fields:['id','staff_id','func_id','authority_level','level','department_id']
    },
    {
        reg:/^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
        fields:['name','staff_name']
    },
    {
        reg:/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
        fields:['phone','staff_account']
    },
    {
        reg:/[a-zA-z]+:\/\/[^\s]*/g,
        fields:['http','url']
    }
];
function add_field(reg,field){
    for(var i = 0; i < regs.length;i++){
        if(regs[i].reg==reg){
            regs[i].fields.push(field);
        }else{
            console.log(regs[i].reg==reg)
        }
    }
}
function getreg(field){
    var result=null;
    for(var i in regs){
        for(var j in regs[i].fields){
            if(regs[i].fields[j]==field){
               result=regs[i].reg;
               break;
            }
        }
    }
    if(!result){
        result=/^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    }
    return result
}
function test(field,value){
    console.log(field,value);
    console.log(getreg(field));
    console.log(getreg(field).test(value));
    return getreg(field).test(value)
}
console.log(test('id',0))
try{
    if(window){
        window.$reg={
            test:test
        }
    }
}catch(e){
}
try{
    if(module){
        module.exports.getreg=getreg;//根据传入的字段返回正则
        module.exports.test=test;
    }
}catch (e) {

}

