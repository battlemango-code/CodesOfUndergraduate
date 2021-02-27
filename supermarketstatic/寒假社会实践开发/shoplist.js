$.ajax({
    url: "http://www.honest_a19.com/products/pageManage?" + param,
    data:{
        productId:"",
        productImgurl:"",
        productName:"",
        productPrice:"",
    },
    dataType:"json",
    type:"get",
    success: function (data) {
        for ( var i=0;data.rows.length > i;i++) {
            var product=data[i];
            $.each(data.rows, function (product) {
                let product_html = "shoplist.html?productId=" + product.productId;
                // let productId = product.productId;
                $(".mianlist").append(
                    "<div id='prod_div'>" +
                        "<a id='prod_img' href=" + product_html + "><img src='" + product.productImgurl + "alt='商品图片'/> </a>"+
                        "<div id='prod_name_div'><a href=" + product_html + ">" + product.productName + "</a></div>" +
                            "<div id='prod_price_div'>￥" + product.productPrice + "元</div>" +
                        "<div>" +
                    "</div>" 
                    );
                })
            }
        }, 
        error: function () {
            alert("请求失败");
        }  
})

/**
 * divObj:显示翻页的div，默认body。如：#pageDiv
 * inputId:跳转页面的id，默认goPage。如：goPage
 * js:点击过之后执行js的方法名。默认query。如：query
 * records:总页数，默认1。
 * total：总记录数，默认0。
 * page：当前页，默认1。
 */
function displayPage(divObj,inputId,js,records,page,total){
    //设置默认值   
    divObj = divObj||"body";
    inputId = inputId||"goPage";
    js=js||"query";
    records=records||1;
    total=total||0;
    page=page||1;
    var str = "当前第&ensp;<span name='page'>"+page+"</span>&ensp;页";
    str += "&ensp;共&ensp;<span name='total'>"+records+"</span>&ensp;页";
    str += "&ensp;<a href='javascript:void(0)' onclick='"+js+"(1)'>首页</a>";
    if(page>1){
      str += "&ensp;<a href='javascript:void(0)' onclick='"+js+"("+(page-1)+")'>上一页</a>";
    }else{
      str += "&ensp;<a>上一页</a>";
    }
    if(page<records){
      str += "&ensp;<a href='javascript:void(0)' onclick='"+js+"("+(page+1)+")'>下一页</a>";
    }else{
      str += "&ensp;<a>下一页</a>";
    }
    str += "&ensp;<a href='javascript:void(0)' onclick='"+js+"("+records+")'>尾页</a>";
    str += "&ensp;跳转到&ensp;<input type='number' min=1 max="+records+" id='"+inputId+"' value="+page+" style='width:40px'/>";
    str += "&ensp;<input type='button' value='go' onclick='var num=$(\"#"+inputId+"\").val();"+js+"(num)'/>";
    $(divObj).empty();
    $(divObj).append(str);
  }

  
var pagination = function (o){

    /**
     * 翻页会出现的情况：
     * 总页数 > 限制页数  30 > 10
     * 总页数 < 限制页数  5 < 10
     * 总页数 = 限制页数  10 = 10
     * @var pnCount - 显示多少页码 =>  限制显示页码 < 页码总数 （按限制显示） ： 限制显示页码 > 页码总数 （按页码总数显示）
     * @var midN - 翻页的中间页码位置
     *
    */

    var config = {
        count: o.count || 10,
        limit: o.limit || 5, //每页显示的条数
    };

    var count = config.count,
        limit = config.limit,
        eUl = dorea(".pagination ul")[0],
        ePre = dorea(".pagination .page-pre")[0],
        eNext = dorea(".pagination .page-next")[0],
        eUlChild = eUl.children,
        pnCount = limit < count ? pnCount = limit : pnCount = count,
        midN = Math.ceil( pnCount / 2 );

    /* 初始化上下翻页的页码 */

    ePre.setAttribute("data-page","1");
    eNext.setAttribute("data-page","1"); 

     

    /*
        * @func renderPag
        * @desc 渲染分页 
        * @param { string } startN - 页码起始数 
        * @param { string } currP - 当前页数 ，初始化该函数时可不传 
        * @var childLen - 所有的子元素（页码）的长度
    */

    var renderPag = function (startN,currP){
        var childLen = eUlChild.length;
        /* 渲染前先清空所有页码 */
        for ( var d = childLen-1; d>=0; d-- ) {
            eUlChild[d].parentNode.removeChild(eUlChild[d]);
        }

        /* 渲染页码 */
        for ( var i = startN; i<pnCount+startN;i++){
            var eLi = creatEle("li"),
            eA = creatEle("a");
            eA.innerHTML = i;
            eA.setAttribute("href","javascript:;");
            eLi.setAttribute("data-page",i);
            eLi.appendChild(eA);
            eUl.appendChild(eLi);


            /* 添加页码的点击事件，获取当前页码currPage */
            eLi.addEventListener("click",function (){
                var currPage = this.getAttribute("data-page");
                turnPag(currPage);
                ePre.setAttribute("data-page",currPage);
                eNext.setAttribute("data-page",currPage);
            });
        }

        /* 每次重新渲染翻页时，判断当前页情况（是否属于首页和尾页） */
        if (currP!==undefined) {
            if (currP=="1") {
                ePre.style.color = "#d2d2d2";
                ePre.style.cursor = "not-allowed";
                ePre.removeEventListener("click",preFn,false);
            }else if(currP==count){
                eNext.style.color = "#d2d2d2";
                eNext.style.cursor = "not-allowed";
                eNext.removeEventListener("click",nextFn,false);
            }else{
                ePre.style.color = "#333";
                ePre.style.cursor = "pointer";
                eNext.style.color = "#333";
                eNext.style.cursor = "pointer";
                ePre.addEventListener("click",preFn,false);
                eNext.addEventListener("click",nextFn,false);
            }
        }
    };

    /**
     * @func turnPag
     * @desc 翻页事件判断，主要用于点击事件发生后，进行页码渲染前的判断
     * @param { string } cp - 传入一个点击所获得的当前页数
     * 情况：1) count > limit
     *          a). limit的前半部分页码，例如 10,5 ，前半部分是 1,2 => 起始页为 1
     *          b). limit的后半部分页码，例如 10,5 ，后半部分是 9,10 => 起始页为 (count-limit)+1
     *          b). limit的中间部分，例如 10,5 ，中间部分是 4-7 => 起始页为 (当前页 - (limit/2))+1
     * 情况：2) count = limit => 起始页为 1
     * 情况：3) count < limit => 限制10条，但真实数据确只有5条
     *          a). 发生这类情况，限制条数应以总数据条数为准则
     *
    */

    var turnPag = function (cp){
        console.log("当前第 "+cp+" 页");
        if (count>limit) {
            if ( cp<=midN ) { //判断是否属于前部分
                renderPag(1,cp);
            }else if( cp<=count && cp>count - midN ){ //判断是否属于后部分
                renderPag( (count - limit)+1 ,cp) ;
            }else{
                renderPag( (cp-midN)+1 ,cp);
            }
        }else if (count===limit || count<limit){
            renderPag(1);
        }else{
            renderPag( (count - midN)-1 ,cp);
        }

         

        for (var i = 0; i<eUlChild.length;i++){
            eUlChild[i].style.backgroundColor = "#fff";
            if (eUlChild[i].getAttribute("data-page") == cp) {
                eUlChild[i].style.backgroundColor = "#1E9FFF"; /* 选中状态 */
            }
        }
    };

    /**
     * @func preFn
     * @desc 上翻页
     * @func nextFn
     * @desc 下翻页
     */

    var preFn = function (){
        var currPage = this.getAttribute("data-page");
        currPage--;
        turnPag(currPage);
        ePre.setAttribute("data-page",currPage);
        eNext.setAttribute("data-page",currPage);
    };

    var nextFn = function (){
        var currPage = this.getAttribute("data-page");                   
        currPage++;
        turnPag(currPage);
        ePre.setAttribute("data-page",currPage);
        eNext.setAttribute("data-page",currPage);
    };

    renderPag(1);

 

    /*
        * 初次渲染翻页时，判断当前的总页数情况，初始化翻页功能
        * 情况： 1) count > limit 上翻页：暗色，删除事件 - 下翻页：亮色，点击事件
        * 情况： 2) count = limit 上下翻页：暗色，删除事件
        * 情况： 3) count < limit 上下翻页：暗色，删除事件
    */

    if (count>limit) {
        ePre.style.color = "#d2d2d2";  
        ePre.style.cursor = "not-allowed";
        ePre.removeEventListener("click",preFn,false);
        eNext.addEventListener("click",nextFn,false);
    }else{
        ePre.style.color = "#d2d2d2";
        ePre.style.cursor = "not-allowed";
        ePre.removeEventListener("click",preFn,false);
        eNext.style.color = "#d2d2d2";
        eNext.style.cursor = "not-allowed";
        eNext.removeEventListener("click",nextFn,false);

    }

}