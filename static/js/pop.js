function pop(option,cb){
    //创建遮罩
    var infinite = option?option.infinite||false:false;
    console.log(infinite);
    var mask = document.createElement('div');
    mask.style.position="fixed";
    mask.style.transition="all 0.5s";
    mask.style.opacity="0";
    mask.style.width="100%";
    mask.style.height="100%";
    mask.style.zIndex="99998";
    mask.style.left=0;
    mask.style.top=0;
    mask.style.backgroundColor="rgba(0,0,0,0.3)";
    var pop_container = document.createElement('div');
    var __width = 300;
    var __bgc ='#ffffff';
    var __color = '#000000';
    var __size = '18';
    var __text = '这是一个弹出框...';
    var __times = 3000;
    var __confirm = "确认";
    var __btn_bgc = "#00f300";
    var __btn_color = "#262626";
    var __top="50%";
    var __left="50%";
    if(option){
        __width = option.width||300;
        __bgc =option.bgColor||'#ffffff';
        __color = option.color||'#000000';
        __size = option.size||'18';
        __text = option.text||'这是一个弹出框...';
        __times = option.time||2500;
        __confirm = option.btn||option.confirm||"确认";
        //__left="30%";
        __top=25;
    }
    var __timer = null;
    pop_container.style.transition="all 0.5s";//动画
    pop_container.style.opacity="0";//先隐藏,然后显示
    pop_container.style.width=__width+'px';
    pop_container.style.margin="0 auto";
    pop_container.style.height='auto';
    pop_container.style.position="absolute";
    pop_container.style.zIndex="99999";
    pop_container.style.left='50%';
    pop_container.style.top=(__top+20)+"%";
    //pop_container.style.transform="translate(-50%,-50%)";
    pop_container.style.margin="0 -"+(Math.floor(__width/2))+"px";
    pop_container.style.padding="5px";
    pop_container.style.backgroundColor = __bgc;
    pop_container.style.color = __color;
    pop_container.style.fontSize = __size+'px';
    pop_container.style.boxShadow = '5px 5px 10px 1px black';
    var _text = document.createElement('div');
    _text.style.width="auto";
    _text.style.height="auto";
    _text.style.padding="10px";
    _text.style.margin="5px";
    _text.style.fontSize = (__size-0+1)+'px';
    _text.innerHTML=__text;
    pop_container.appendChild(_text);
    var __btnbox = document.createElement('div');
    __btnbox.style.maxWidth="180px";
    __btnbox.style.height="40px";
    __btnbox.style.lineHeight="40px";
    __btnbox.style.textAlign="center";
    __btnbox.style.padding="0 5px";
    __btnbox.style.backgroundColor=__btn_bgc;
    __btnbox.style.color=__btn_color;
    __btnbox.style.margin="0 auto";
    __btnbox.style.cursor="pointer";
    __btnbox.style.fontSize = (__size-1)+'px';
    __btnbox.style.fontWeight = 700;
    __btnbox.innerHTML=__confirm;
    __btnbox.onclick=function(){
        clearTimeout(__timer);
        __timer=null;
        pop_container.style.opacity="0";
        pop_container.style.top=(__top+20)+"%";
        mask.style.opacity="0";
        setTimeout(function(){
            document.body.removeChild(mask);
            if(cb){
                cb();
            }
        },500);
    };
    pop_container.appendChild(__btnbox);
    setTimeout(function(){
        mask.style.opacity="1";
        pop_container.style.top=__top+"%";
        pop_container.style.opacity="1";
    },10);

    autoCenter(pop_container);
    // 创建弹窗
    //输入内容
    //显示
    if(!infinite){
        __timer = setTimeout(function(){
            clearTimeout(__timer);
            __timer=null;
            pop_container.style.opacity="0";
            mask.style.opacity="1";
            pop_container.style.top=(__top+20)+"%";
            mask.style.opacity="0";
            setTimeout(function(){
                document.body.removeChild(mask);
                if(cb){
                    cb();
                }
            },500);
        },__times);
    }
    mask.appendChild(pop_container);
    document.body.appendChild(mask);
};


function confirm_pop(option,yes_cb,no_cb){
    //创建一个选择框
    if(arguments.length<2){
        return console.log('该方法至少需要两个参数,一个配置和确认后的回调参数.如果是单纯的提示请使用pop')
    }
    var opt = {
        text:option.text||"这是一个点击框",
        yes_btn:option.yes_btn||"yes",
        no_btn:option.no_btn||"no",
        size:option.size||16,
        border_radius:option.border_radius||2,
        btn_bg:option.btn_bg||option.btn_background_color||'#518bfa',
        btn_c:option.btn_c||option.btn_color||'#eee',
        mask_bg:option.mask_bg||'rgba(0,0,0,0.3)',
        bg:option.bg||"#eee",
        c:option.c||option.color||"#222"
    }
    var mask = document.createElement('div');
    mask.style.position="fixed";
    mask.style.transition="all 0.5s";
    mask.style.opacity="0";
    mask.style.width="100%";
    mask.style.height="100%";
    mask.style.zIndex="99998";
    mask.style.left=0;
    mask.style.top=0;
    mask.style.backgroundColor="rgba(0,0,0,0.3)";
}
function autoCenter(el){
    //获取父级元素宽度,
    //取一半,加上元素的一半
    var parent=el.offsetParent;
    //var width=parent.offsetWidth();
    console.log(parent);
}