//用来存储某物,短期存储
// 添加一条数据,设置过期时间

let repository = {
    length:0,//记录长度
    expireTime:1000*60*15,//默认的过期时间
    datas:{

    }//以key value 模式存储对应的数据
};
// 数据结构   存储的id 存储的值 过期时间 毫秒数默认为15分钟
function Store(id,data){
    this.id = id;//数据的id  key
    this.data = data;//存储的数据   value
    this.timer = null;//对象的计时器
    this.time = 0;//过期毫秒数
}

function forEach(cb){
    // 高阶函数
    for(var key in repository.datas){
        cb(repository.datas[key],key)
    }
}//循环获取所有数据
function traverse(cb){

}//依次拉取数据

Store.prototype.expire=function(time){//重置过期时间
    time = time||repository.time;//如果没有过期时间则使用默认时间
    // 过期时间
    clearTimeout(this.timer);// 首先清除上一次计时
    this.timer = null;
  //设置过期时间,在过期之后删除自身
    this.timer=setTimeout(()=>{
        // 从仓库中移除自身
        for(var key in  repository.datas){
            if(repository.datas[key].id === this.id){
                delete repository.datas[key];
                delete this//删除自己?是否可行
                repository.length--;//总数自减
            }
        }
    },time);
    return this;
};//过期时间


function newstore (data){
    repository.length =repository.length+1;//索引自增
    var store = new Store(repository.length,data);//创建对象,使用自增id
    store.expire(repository.expireTime);//创建之后便开始计时
    repository.datas[repository.length] = store;//存储对象
    return store;
}

// var arr = [];
// for(let i =0;i<100;i++){
//     var obj = {name:"这是第"+i+"个数据"};
//     var s = newstore(obj).expire(2000);
// }
// setTimeout(function(){
//     console.log('repository.datas---被删除测试-----');
//     console.log(repository.datas);
// },3000);

module.exports.newstore = newstore;//创建新数据
module.exports.foreach = forEach;//循环获取数据,获取到的数据可以更新其数据
