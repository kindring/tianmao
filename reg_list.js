//正则列表,用于匹配相应正则
const regs = [{
        fields:[],
        reg:/\d/
    },{
        fields:[],
        reg:/\d/
    },{
        fields:[],
        reg:/\d/
    },{
        fields:[],
        reg:/\d/
    }];

module.exports=function(field){
    for(var i in regs){
        for(var x in regs[i].fields){
            if(field==regs[i].fields[x]){
                return regs[i].reg//在检测到有相应的记录时返回正则
            }
        }
    }
};