
//如何获取数据,自己主动获取数据或者是传入

//将数据push至指定dom中

//如何触发操作

//如何渲染数据

//创建一个多级联动数据结构

// 如何获取下级数据

function getOneCategory(){
    //获取全部分类数据
    var categor_data = document.getElementById('categor_data');
    console.log(categor_data.value);
    return eval(categor_data.value);
}//获取一级分类下的所有数据

function getTwoCategory(parent_id,cb){
    $.get("../platform_goods/categorys?parent_id="+parent_id,function(result){
        if(result.code === 200){
            //成功
            cb(result.data);
        }else{
            console.log(result)
        }
    })
}//获取某个分类下的数据

function renderFirstCategory(categorys,level){//输入等级和分类
    level = level||0;//设置默认值
    var temp_html = "";
    for(var i in categorys){
        temp_html += '<li val="' + categorys[i].id + '">' + categorys[i].name + '</li>';
    }//成功渲染完成html模板
    //push至指定位置
    $('.select-box ul:eq(' + level + ')').html(temp_html);
}//渲染至指定位置
//先行将一级分类的数据渲染
renderFirstCategory(getOneCategory());
$('span', $('.select-res')).on('click', function() {
    //alert("test");
    $('.select-box').show();

});//显示可选框
var firstCategoryId = 0;
var secondCategoryId = 0;
var thirdCategoryId = 0;
var firstCategorys = getOneCategory();//列表
var secondCategorys = null;
var thirdCategorys = null;
var categorysPath = [];//用数组来存储路径,即一级二级三级
var lastCategory = null;//最后一次点击的分类
$('ul.first', $('.select-box')).on('click', 'li', function() {
    $(this).addClass('selected').siblings().removeClass('selected');
    $('ul.third').html('');//清空二级分类列表?
    //获取当前的分类等级
    firstCategoryId = $(this).attr('val');
    for(var i in firstCategorys){
        if(firstCategorys[i].id==firstCategoryId){
            categorysPath=[];
            categorysPath.push(firstCategorys[i]);
            break;
        }
    }
    getTwoCategory(firstCategoryId,function(categorys){
        //获取下级数据
        secondCategorys = categorys;
        renderFirstCategory(categorys,1);
    });
});
$('ul.second', $('.select-box')).on('click', 'li', function() {
    $(this).addClass('selected').siblings().removeClass('selected');
    secondCategoryId = $(this).attr('val');
    for(var i in secondCategorys){
        if(secondCategorys[i].id==secondCategoryId){
            console.log("匹配成功");
            categorysPath[1] = null;
            categorysPath[1] = secondCategorys[i];
            categorysPath.length = 2;
            //长度为二
            break;
        }
    }
    getTwoCategory(secondCategoryId,function(categorys){
        //获取下级数据
        thirdCategorys = categorys;
        renderFirstCategory(categorys,2);
    });
    // 点击二级分类
});
$('ul.third', $('.select-box')).on('click', 'li', function() {
    $(this).addClass('selected').siblings().removeClass('selected');
    cname3 = $(this).text();
    thirdCategoryId = $(this).attr('val');
    for(var i in thirdCategorys){
        if(thirdCategorys[i].id==thirdCategoryId){
            categorysPath[2] = null;
            categorysPath[2] = thirdCategorys[i];
            break;
        }
    }
    //console.log("点击三级分类");

});

$(document).ready(function(){
    $("#estimate-data").click(function(e){
        //判断是否跳转
        console.log(categorysPath);
        if(categorysPath.length<2){
            e.preventDefault();
            return pop({text:"至少选择二级分类"})
        }
        document.getElementById("categoryPath").value = JSON.stringify(categorysPath);

    })
});

//使用递归调用子元素的所有toString方法
function toString(obj){
        //如果有长度属性,并且其类型不为字符串则递归调用
        console.log(obj);
        if(typeof(obj)=="string"){return obj}
        if(typeof(obj)=="object"){return JSON.stringify(obj[i])}
        if(!obj){return "null"}
        for(var i in obj){
            //console.log(obj[i]);
            obj[i] = toString(obj[i]);
        }
        return obj.toString();
}






