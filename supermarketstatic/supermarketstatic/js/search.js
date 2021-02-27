$('line2').on('input',function(){
    var key=$("text");
    inintSearchlist();
});

function inintSearchlist(){
    $.ajax({
        url:"",/* ? */
        type:"post",
        data:JSON.stringify(key),
        dataType:"html",
        success(data){
            console.log("success");
        },
        error:function(){console.error();}
    })
}